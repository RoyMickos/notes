### Unit tests ftw
Test as much as possible with unit tests. This includes all functionality, business rules, and other core functionality. Use mocks as needed to create a simple and effective, low-barrier environment for testing.
Decouple unit tests from the structure of your code. You must be able to change the structure of your code without having to touch the tests. Crete tests to test behavior.
Unit tests enable TDD if that is suitable for the situation. Even with explorarive coding you have repeated patterns you make to check your code, which can be automated and poilished when you settle on thei implementation.

## Integration test to test the pipes
Integration tests primary function is to test connectivity between entities, so that the bytes flow when mocks are replaced with real adapters. Remember to check with the boundaries (prisitne system with no data etc). With bytes flowing as expected, you carry over unit test results here.

## E2E in as close to production as possible
Ideally use E2E in environments that are as close as possible to production, ideally against a test system. With this you can reach for automated deployments.
