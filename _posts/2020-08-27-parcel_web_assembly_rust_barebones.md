---
layout: post
title:  "Getting Started with Web Assembly using Rust and Parcel"
date:   2020-08-27 21:51:29 -0500
categories: 
    - rust 
    - parcel 
    - javascript 
    - webassembly
---
A few years ago, I spent some time learning [6502][1] assembly. It's what you 
would use if you're going to right a program for something with an 8 bit 
processor, like say the [NES][2] or the [Commodore 64][3]. I learned a lot, 
which is cool, but the main thing I took away was this.

Assembly language is hard. 

It's not meant for people to read. Or, well, I guess it is, but it's densest, most garbage form of something humans can read. 

It is also ruthlessly efficient, much like the spanish inquisition. You didn't expect that, did you?

Now, thanks to [Web Assembly][4], we can harness that ruthless efficiency in our very own Javascript based web apps! Except... yeah... reading assembly still sucks. So instead of trying to write our own Web Assembly, we can compile another language into a Web Assembly binary.

You might be familiar with a tool called WebPack, a bundler that will take all your various files, like TypeScript or Sass or bleeding edge JavaScript, and bundle those files into simple JavaScript and CSS files. Can we somehow use this bundler concept to build a pipeline from Rust to Web Assembly to JavaScript? 

You sure can, but... there's a problem. 
 
You see, there is only one single thing in computer programming more complicated than writing assembly - WebPack configuration files. I sometimes wake up in the middle of night, cold sweat running down my face, nightmares of having to write a WebPack config files from scratch still fresh in my mind. When I close my eyes, they're still there - those config files, haunting me with their infinite mystery... I can go down that route... but let's not.

Enter Parcel. Parcel makes everything horrifyingly easy, giving me just enough rope to hang myself. Let's take a look at setting up a project leveraging the ruthless efficiency of Web Assembly using Parcel and Rust.

Some prereqs before we get started:
1. Rust should be installed. [Check here for how to make sure 
you're ready](https://www.rust-lang.org/tools/install). 
2. Node should be installed. [Instructions here](https://nodejs.org/en/download/)

Ready? Let's do this.

Make a folder, call it `my-awesome-web-assembly-thing-mach-2` or whatever. I don't even care, you crazy soon-to-be-Rustacean, you. Navigate your terminal into that directory.
 
First thing we need to do is create a Rust project that we can compile into our Web Assembly. Run: 
```bash
cargo new rustcode --lib
```
You should see a new directory called <span class="dir">rustcode</span>, and it should contain a very bare bones Rust library project. Being a library project, the code is meant for other projects to use. This is perfect because that's totally what the title of this blogpost implies we want to do.

With our Rust boilerplate out of the way, let's move on to our webpage. Run `npm init`. You should be asked some questions in your terminal - answer them as you see fit or just spam <span class='key-return'>return</span> til you're back to your normal shell. The result of finishing `npm init` is that we'll have a shiny new <span class='file'>package.json</span> file that we can save our JavaScript dependencies to.

Speaking of JavaScript dependencies, let's go ahead and add Parcel. 
```shell script
npm install --save-dev parcel
```
A webpage isn't complete without our old friend <span class="file">index.html</span>, and we'll need a JavaScript file were we're actually going to use . finish creating our project, we'll need an HTML file and a JavaScript file. Make a directory called <span class='dir'>web</span> and create an <span class='file'>app.js</span> file and an <span class='file'>index.html</span> file.

The <span class="file">index.html</span> file just exists as something to run our JavaScript in, so we're done with it for now. Let's move on and write a simple function in Rust that, when compiled into Web Assembly, we can call from our JavaScript.

In the Rust library project we looked at earlier, open up <ol class="path"><li class="dir">rustcode</li> <li class="dir">src</li> <span class="file">lib.rs</span></ol> file. We'll want to empty it out and replace it with something like this:
```rust
#[no_mangle]
pub extern "C" fn valueFromWebAssembly() -> i32 {
    8675309
}
```
This is the function we're going to call from our JavaScript. The  `#[no_mangle]` part tells the compiler we want the functions name to remain unchanged when we compile the code. I might talk more about name-mangling in the future, so stay tuned for that. The `pub extern "C"` portion tells the compiler we want to leave this function exposed to the world, so code using this library can call this function. The only thing this function does right now is return Jenny's number.

Now let's use this function in our JavaScript. Open up <span class="file">app.js</span> and write this:
```javascript
import { valueFromWebAssembly } from './rustcode/src/lib.rs';

document.write(`We received the following value from Web Assembly <strong>${valueFromWebAssembly()}</strong>`);
```

That's right, with Parcel, it's as easy as directly importing our Rust source code. Parcel takes care of compiling our Rust code into Web Assembly and exposing that assembly code to our JavaScript. All that's left to do is bundle our project and see if everything works!
```shell script
node_modules/.bin/parcel index.html 
```
After running that you should see  
```shell output
Server running at http://localhost:1234
```
Go to that url in your browser and you should see this on the page:
>  We received the following value from Web Assembly 8675309

Congratulations! You just web assembled!

[1]: http://www.6502.org/tutorials/ 
[2]: https://nerdy-nights.nes.science/
[3]: https://www.c64-wiki.com/wiki/Machine_language
[4]: https://developer.mozilla.org/en-US/docs/WebAssembly
