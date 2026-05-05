import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface TeamMemberDto {
  id: string;
  displayName: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface ITeamService {
  getLocalTeam(): Observable<TeamMemberDto[]>;
}

export const TEAM_SERVICE = new InjectionToken<ITeamService>('TEAM_SERVICE');

@Injectable({ providedIn: 'root' })
export class TeamService implements ITeamService {
  private http = inject(HttpClient);

  getLocalTeam(): Observable<TeamMemberDto[]> {
    return this.http.get<TeamMemberDto[]>('/api/teams/local');
  }
}
