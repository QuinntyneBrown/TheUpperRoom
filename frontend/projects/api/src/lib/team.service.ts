import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface TeamMemberDto {
  id: string;
  displayName: string;
  email: string;
  roles: string[];
  isActive: boolean;
}

export interface InviteMemberRequest {
  email: string;
  roles: string[];
}

export interface AssignRoleRequest {
  role: string;
  action: 'add' | 'remove';
}

export interface ITeamService {
  getLocalTeam(): Observable<TeamMemberDto[]>;
  invite(req: InviteMemberRequest): Observable<void>;
  assignRole(userId: string, req: AssignRoleRequest): Observable<void>;
}

export const TEAM_SERVICE = new InjectionToken<ITeamService>('TEAM_SERVICE');

@Injectable({ providedIn: 'root' })
export class TeamService implements ITeamService {
  private http = inject(HttpClient);

  getLocalTeam(): Observable<TeamMemberDto[]> {
    return this.http.get<TeamMemberDto[]>('/api/teams/local');
  }

  invite(req: InviteMemberRequest): Observable<void> {
    return this.http.post<void>('/api/teams/local/invitations', req);
  }

  assignRole(userId: string, req: AssignRoleRequest): Observable<void> {
    return this.http.post<void>(`/api/teams/local/members/${userId}/roles`, req);
  }
}
