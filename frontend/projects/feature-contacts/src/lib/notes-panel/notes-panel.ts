import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CONTACT_SERVICE, PARTNER_SERVICE, NoteDto } from 'api';
import { UrButtonComponent } from 'components';

@Component({
  selector: 'ur-notes-panel',
  templateUrl: './notes-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DatePipe, UrButtonComponent],
})
export class NotesPanelComponent {
  targetId = input.required<string>();
  targetType = input<'Contact' | 'Partner'>('Contact');
  initialNotes = input<NoteDto[]>([]);
  currentUserId = input<string>('');

  private contacts = inject(CONTACT_SERVICE);
  private partners = inject(PARTNER_SERVICE);

  notes = signal<NoteDto[]>([]);
  newBody = signal('');
  adding = signal(false);
  editingId = signal<string | null>(null);
  editBody = signal('');
  deletingId = signal<string | null>(null);

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
      error: () => this.adding.set(false),
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

  isOwn(note: NoteDto): boolean {
    return note.authorId === this.currentUserId();
  }
}
