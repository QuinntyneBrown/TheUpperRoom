// Traces to: 76 - API library injection-token contract
// L2-061: feature code injects by token; test substitutes mock without touching component
import { TestBed } from '@angular/core/testing';
import { Component, inject } from '@angular/core';
import { of } from 'rxjs';
import { HEALTH_SERVICE, IHealthService } from './health.service';

@Component({
  selector: 'test-health-consumer',
  template: '',
})
class TestHealthConsumerComponent {
  svc = inject(HEALTH_SERVICE);
}

describe('HEALTH_SERVICE injection token', () => {
  const mockSvc: IHealthService = {
    get: () => of({ status: 'stub', version: '0.0.0', time: '2026-01-01T00:00:00Z' }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHealthConsumerComponent],
      providers: [{ provide: HEALTH_SERVICE, useValue: mockSvc }],
    });
  });

  it('injects the stub without referencing HealthService directly', () => {
    const fixture = TestBed.createComponent(TestHealthConsumerComponent);
    const svc = fixture.componentInstance.svc;
    expect(svc).toBe(mockSvc);
  });

  it('stub returns the configured response', async () => {
    const fixture = TestBed.createComponent(TestHealthConsumerComponent);
    const result = await new Promise<{ status: string }>((resolve) =>
      fixture.componentInstance.svc.get().subscribe(resolve)
    );
    expect(result.status).toBe('stub');
  });
});
