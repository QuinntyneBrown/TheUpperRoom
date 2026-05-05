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
  editingId = signal<string | null>(null);
  editBody = signal('');
  deletingId = signal<string | null>(null);

  private addNoteErrorTimer?: ReturnType<typeof setTimeout>;

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
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.addNoteErrorTimer);
  }

  isOwn(note: NoteDto): boolean {
    return note.authorId === this.currentUserId();
  }
}
