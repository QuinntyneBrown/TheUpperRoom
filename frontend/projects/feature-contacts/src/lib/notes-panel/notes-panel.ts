import { ChangeDetectionStrategy, Component, effect, inject, input, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CONTACT_SERVICE, PARTNER_SERVICE, NoteDto } from 'api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UrButtonComponent } from 'components';

@Component({
  selector: 'ur-notes-panel',
  templateUrl: './notes-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DatePipe, MatButtonModule, MatIconModule, UrButtonComponent],
  styles: [`
    .note-error-toast {
      position: fixed; bottom: 24px; right: 24px; display: flex; align-items: center;
      gap: 10px; padding: 12px 16px; border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-overlay, #1e293b); color: #fff; font-size: 0.875rem; font-weight: 500;
      border: 1px solid var(--ur-danger, #ef4444);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .note-error-toast mat-icon { color: var(--ur-danger, #ef4444); font-size: 18px; width: 18px; height: 18px; }
    .notes-panel { flex: 1; min-width: 0; }
    .notes-panel h2 { margin: 0 0 16px; font-size: 1.125rem; font-weight: 600; color: var(--ur-fg-primary, #f1f5f9); }
    .notes-panel__add { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
    .notes-panel__textarea {
      width: 100%; padding: 10px 12px; border-radius: 6px; resize: vertical; min-height: 72px; box-sizing: border-box;
      border: 1px solid var(--ur-border-default, #475569);
      background: var(--ur-bg-elevated, #0f172a); color: var(--ur-fg-primary, #f1f5f9);
      font-size: 0.875rem; font-family: inherit; outline: none;
    }
    .notes-panel__textarea:focus { border-color: var(--ur-accent-primary, #6366f1); }
    .notes-panel__empty {
      display: flex; align-items: center; gap: 8px; padding: 12px 0;
      color: var(--ur-fg-muted, #64748b); font-size: 0.875rem;
    }
    .notes-panel__empty mat-icon { font-size: 18px; width: 18px; height: 18px; opacity: 0.6; }
    .notes-panel__empty p { margin: 0; }
    .note-card { padding: 12px 0; border-bottom: 1px solid var(--ur-border-subtle, #334155); }
    .note-card:last-child { border-bottom: none; }
    .note-card__body { margin: 0 0 6px; font-size: 0.875rem; color: var(--ur-fg-primary, #f1f5f9); white-space: pre-wrap; }
    .note-card__meta { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .note-card__meta time { font-size: 0.75rem; color: var(--ur-fg-muted, #64748b); }
    .note-card__actions { display: flex; gap: 4px; }
    .note-card__confirm { margin: 0 0 8px; font-size: 0.875rem; color: var(--ur-fg-secondary, #94a3b8); }
  `],
})
export class NotesPanelComponent implements OnDestroy {
  targetId = input.required<string>();
  targetType = input<'Contact' | 'Partner'>('Contact');
  initialNotes = input<NoteDto[]>([]);
  currentUserId = input<string>('');

  private contacts = inject(CONTACT_SERVICE);
  private partners = inject(PARTNER_SERVICE);

  notes = signal<NoteDto[]>([]);
  newBody = signal('');
  adding = signal(false);
  addNoteError = signal(false);
  noteOperationError = signal(false);
  editingId = signal<string | null>(null);
  editBody = signal('');
  deletingId = signal<string | null>(null);

  private addNoteErrorTimer?: ReturnType<typeof setTimeout>;
  private noteOperationErrorTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      this.notes.set([...this.initialNotes()].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    });
  }

  addNote(): void {
    const body = this.newBody().trim();
    if (!body) return;
    this.adding.set(true);
    const add$ = this.targetType() === 'Partner'
      ? this.partners.addNote(this.targetId(), body)
      : this.contacts.addNote(this.targetId(), body);
    add$.subscribe({
      next: (note) => {
        this.notes.update((ns) => [note, ...ns]);
        this.newBody.set('');
        this.adding.set(false);
      },
      error: () => {
        this.adding.set(false);
        clearTimeout(this.addNoteErrorTimer);
        this.addNoteError.set(true);
        this.addNoteErrorTimer = setTimeout(() => this.addNoteError.set(false), 5000);
      },
    });
  }

  startEdit(note: NoteDto): void {
    this.editingId.set(note.id);
    this.editBody.set(note.body);
  }

  saveEdit(noteId: string): void {
    const body = this.editBody().trim();
    if (!body) return;
    this.contacts.updateNote(noteId, body).subscribe({
      next: () => {
        this.notes.update((ns) =>
          ns.map((n) => (n.id === noteId ? { ...n, body } : n))
        );
        this.editingId.set(null);
      },
      error: () => {
        clearTimeout(this.noteOperationErrorTimer);
        this.noteOperationError.set(true);
        this.noteOperationErrorTimer = setTimeout(() => this.noteOperationError.set(false), 4000);
      },
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  confirmDelete(noteId: string): void {
    this.deletingId.set(noteId);
  }

  cancelDelete(): void {
    this.deletingId.set(null);
  }

  doDelete(noteId: string): void {
    this.contacts.deleteNote(noteId).subscribe({
      next: () => {
        this.notes.update((ns) => ns.filter((n) => n.id !== noteId));
        this.deletingId.set(null);
      },
      error: () => {
        this.deletingId.set(null);
        clearTimeout(this.noteOperationErrorTimer);
        this.noteOperationError.set(true);
        this.noteOperationErrorTimer = setTimeout(() => this.noteOperationError.set(false), 4000);
      },
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.addNoteErrorTimer);
    clearTimeout(this.noteOperationErrorTimer);
  }

  isOwn(note: NoteDto): boolean {
    return note.authorId === this.currentUserId();
  }
}
