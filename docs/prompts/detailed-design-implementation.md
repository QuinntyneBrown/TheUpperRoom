


Pull any changes from origin

Find a detailed design in C:\projects\TheUpperRoom\docs\detailed-designs that is not implemented respecting the sequential order.

Mark the design as accepted.

COMMIT ALL CHANGES AND PUSH TO ORIGIN


Implement the detailed design using Acceptance Test Driven Development.

    1. Write the failing tests (Unit and / or e2e Playwright Test using Page Object Model).

    2. COMMIT ALL CHANGES AND PUSH TO ORIGIN

    3. Implement the simplest radically simple code to make the tests pass

        - TARGETING THE LOWEST COMPLEXITY SCORE POSSIBLE

    4. COMMIT ALL CHANGES AND PUSH TO ORIGIN

    5. Audit the implementation 5 times for radical simplicity and completeness against the detail design, docs and C:\projects\TheUpperRoom\docs\ui-design.pen.

        a) Can the implementation be made more testable or simpler? Fix it

        b) If a UI change, ensure the correct icons visible to user in browser, fonts, spacing, etc...

        c) Can a change reduce the complexity score to make it more approach by a junior dev (1 year experience with Angular)? Change it

        d) Are all the styles sheets configured properly in angular.json and index.html

        e) Is the padding and margin correct in buttons and inputs. Is text alignment correctly


    6. Mark detailed design as complete

    7. COMMIT ALL CHANGES AND PUSH TO ORIGIN