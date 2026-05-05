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

export interface GlobalTeamSummaryDto {
  id: string;
  city: string;
  memberCount: number;
  prayerLeadCount: number;
  eventLeadCount: number;
  communicationLeadCount: number;
  activeHackathonCount: number;
  partnerCount: number;
}

export interface GlobalTeamsResult {
  rows: GlobalTeamSummaryDto[];
  total: number;
}

export interface GlobalTeamDetailDto {
  id: string;
  city: string;
  memberCount?: number;
  members?: TeamMemberDto[];
  activeHackathonCount: number;
  partnerCount: number;
}

export interface ITeamService {
  getLocalTeam(): Observable<TeamMemberDto[]>;
  invite(req: InviteMemberRequest): Observable<void>;
  assignRole(userId: string, req: AssignRoleRequest): Observable<void>;
  listGlobalTeams(page?: number, size?: number, search?: string): Observable<GlobalTeamsResult>;
  getGlobalTeam(id: string): Observable<GlobalTeamDetailDto>;
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

  listGlobalTeams(page = 1, size = 25, search?: string): Observable<GlobalTeamsResult> {
    const params: Record<string, string | number> = { page, size };
    if (search) params['search'] = search;
    return this.http.get<GlobalTeamsResult>('/api/teams', { params: params as never });
  }

  getGlobalTeam(id: string): Observable<GlobalTeamDetailDto> {
    return this.http.get<GlobalTeamDetailDto>(`/api/teams/${id}`);
  }
}
