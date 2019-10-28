# Basically, React Suspense

[See demo](https://tejasq.github.io/basically-react-suspense) | [See documented source code](index.js)

> ⚠️ **Disclaimer:** I do not work on React core at all and this is a huge guess. I have not extensively looked at the source code of this feature and I don't really know what I'm doing, so please take this with a grain of salt and refer to the React core team for offical things. This repo here is my personal exploration to _learn_ these things _publicly_ (thanks, @swyx). I might have gotten it either partially or completely wrong. In this case, hopefully someone will gently correct me if things are not quite right and help me figure out the "truth"/the right way this works.

## The Code

Take a look at [index.js](index.js) to see how (I think) it works. We have:

- a [central cache](index.js#L2)
- a ["resource creator"](index.js#L6-L21)
- some "components" that [fetch things](index.js#L23-L51) using a resource
- finally, [the "core"](index.js#L53-L93) that ties it all together.

Each of these should be well documented and easy to grok. If they aren't, please [open an issue](/issues). Also, if I got something wrong, please please please let me know by [opening an issue](/issues).

## Algebraic Effects

I kind of accidentally wrote this while researching/learning about **algebraic effects**. I've heard a lot of this terminology around React's shiny new (and still experimental!) [Concurrent Mode](https://reactjs.org/docs/concurrent-mode-intro.html) and so I wondered how it fit in. Turns out this might be how. `¯\_(ツ)_/¯`. I think this is really novel because algebraic effects allow code to behave in a synchronous way while still preserving asynchronous functionality.

`async`/`await` allows similar syntax, but any function automatically returns a [`Promise`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) when prepended with the `async` keyword, and thus, leads to a special kind of async hell when we want to do something synchronous. With algebraic effects, functions can be synchronous while allowing an external [async effect handler](http://homepages.inf.ed.ac.uk/gdp/publications/Effect_Handlers.pdf) to deal with the async part. The cool thing about this is the handler could be swapped out for pretty much anything centrally, and "user code" stays exactly the same.

Another benefit is that it literally "defers" to an effect handler higher in scope. I think the best analogy for algebraic effects is `try/catch` blocks. No matter where the code comes from that is enclosed in `try`, a `catch` handler in a different scope/context is fired and can handle exceptions from _literally anywhere_. This is quite cool. Applied to data fetching, one can `try` to use data that _might_ be available. If it's not available, the exception (or effect handler) of _"I have no data"_ is _caught_ wherever we have a handler and it is processed accordingly.

## More Things

If you'd like to have a chat or discuss things more, or even request more explainer-type things, [@me on twitter](https://twitter.com/tejaskumar_).
