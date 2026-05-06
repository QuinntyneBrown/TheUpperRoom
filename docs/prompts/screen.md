


1. Pull any changes from origin

2. Ensure the backend, frontend and entire app is running and accessible via url

3. Find a screen in C:\projects\TheUpperRoom\docs\screens

4. Follow the "How to navigate" to open the page in the browser.

5. Verify the implemented page in url completely matches the Designs (frames) referenced in the screen markdown document.

6. Log any discrepencies as a bug

7. For each logged bug in session

    a) Write the failing tests (Unit and / or e2e Playwright Test using Page Object Model) for the fix.

    b) COMMIT ALL CHANGES AND PUSH TO ORIGIN

    c) Implement the simplest radically simple code to fix the bug and make the tests pass

        - TARGETING THE LOWEST COMPLEXITY SCORE POSSIBLE

    d) COMMIT ALL CHANGES AND PUSH TO ORIGIN

    e) Audit the implementation 2 times for radical simplicity

        i) Can the implementation be made more testable or simpler? Fix it

        ii) If a UI change, ensure the correct icons visible to user in browser, fonts, spacing, etc...

        iii) Can a change reduce the complexity score to make it more approach by a junior dev (1 year experience with Angular)? Change it


    f. Mark bug as fixed

    g. COMMIT ALL CHANGES AND PUSH TO ORIGIN