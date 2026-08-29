export default function memoizeOne<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  equals: (left: Args, right: Args) => boolean = (left, right) =>
    left.length === right.length && left.every((value, index) => Object.is(value, right[index])),
): (...args: Args) => Result {
  let called = false;
  let previousArgs: Args;
  let previousResult: Result;
  return (...args: Args): Result => {
    if (called && equals(args, previousArgs)) return previousResult;
    called = true;
    previousArgs = args;
    previousResult = fn(...args);
    return previousResult;
  };
}
