In go, anyone can create structs using the `pkg.Type{}` literal syntax. Hence, there is no point to check for business rules/invariants. A common pattern in this case is to declare all or some members of the struct as private/hidden, and use dedicated factory functions to create the structs.  This means you must create getters and setters for ypur structs, but you would need it anyway because only functions can check invariants.

```go
package domain

import (
	"errors"
	"strings"
	"time"
)

type Note struct {
	name       string
	body       string
	noteType   string
	ownerEmail string
	tags       []string
	created    time.Time
	modified   time.Time
}

// NewNote enforces invariants and provides a controlled way to create a Note
func NewNote(name, body, noteType, ownerEmail string, tags []string) (*Note, error) {
	if strings.TrimSpace(name) == "" {
		return nil, errors.New("name cannot be empty")
	}

	if !isValidEmail(ownerEmail) {
		return nil, errors.New("invalid email format")
	}

	now := time.Now()
	return &Note{
		name:       name,
		body:       body,
		noteType:   noteType,
		ownerEmail: ownerEmail,
		tags:       tags,
		created:    now,
		modified:   now,
	}, nil
}

// Utility function to validate email format (basic check)
func isValidEmail(email string) bool {
	return strings.Contains(email, "@")
}

// Getter methods (since fields are unexported)
func (n *Note) Name() string       { return n.name }
func (n *Note) Body() string       { return n.body }
func (n *Note) Type() string       { return n.noteType }
func (n *Note) OwnerEmail() string { return n.ownerEmail }
func (n *Note) Tags() []string     { return n.tags }
func (n *Note) Created() time.Time { return n.created }
func (n *Note) Modified() time.Time { return n.modified }

// Update methods to enforce controlled changes
func (n *Note) UpdateBody(newBody string) {
	n.body = newBody
	n.modified = time.Now()
}

func (n *Note) UpdateTags(newTags []string) {
	n.tags = newTags
	n.modified = time.Now()
}
```