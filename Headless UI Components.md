A technique to separate logic from representation in UI components. Here with react, using render props:
```jsx
const run = () => ({
  random: Math.random(),
});

class Probability extends React.Component {
  state = run();

  handleClick = () => {
    this.setState(run);
  };

  render() {
    return this.props.children({
      rerun: this.handleClick,

      // By taking in a threshold property we can support
      // different odds!
      result: this.state.random < this.props.threshold,
    });
  }
}
```
...and one would use it like so:
```jsx
const RollDice = () => (
  // Six Sided Dice
  <Probability threshold={1 / 6}>
    {({ rerun, result }) => (
      <div>
        {/* She was able to use a different event! */}
        <span onMouseOver={rerun}>Roll the dice!</span>
        {/* Totally different interface! */}
        {result ? (
          <div>Big winner!</div>
        ) : (
          <div>You win some, you lose most.</div>
        )}
      </div>
    )}
  </Probability>
);
```

This allows one to create tests for the logic, not the UI.
Some of the more complex hooks offer the same idea.

[Original article](https://www.merrickchristensen.com/articles/headless-user-interface-components)