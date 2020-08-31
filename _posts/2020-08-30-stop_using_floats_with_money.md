---
layout: post
title:  "Stop Using Floats as Money"
date:   2020-08-30 08:51:29 -0500
categories:
    - programming concepts
---
I've been tasked many times with writing bits of code that charge people money. 

Here's the thing you have to understand about me. I grew up poor. First world poor, where food stamps and federal programs kept me and my family from starving, sure. I will forever be grateful to have lived in a country where programs like that exist, and I'll never question paying taxes in a country where my money can eventually make it's way to keeping another poor kid from starving. So it should come as no surprise that I take money seriously. 

What might be surprising is that I take everyone's money seriously, mine - what I have and is owed to me, and yours - what you have and what is owed to you. Everytime I see someone else processing financial data using floating-point integers, I know they do not share my concerns. Everytime I see a [`Math.round`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round) used on money, I lose a little more hope.

So in an effort to stop me from dying on the inside all the time, let's talk about why floats are the wrong choice, and what the right way to write code for financial transactions.

## What's the Problem?

Classical computers - the kind of computer you're using right now, be it your phone,  laptop, etc - store all data in a series of binary values. Most people say 1s and 0s, or offs and ons, but that's not really correct, and not the most important takeaway. <span title="As opposed to de-stinked, which happens when I clean my cat's litter box.">The thing to remember is there are always only two values, and they are always distinct from each other.</span>

The computer can be instructed to interpret those values as 0s and 1s, and a series of those 0s and 1s can be interpreted as a [base-2 integer](https://en.wikipedia.org/wiki/Binary_number). Base-2 integers are just one way of counting numbers - not so different from our base-10 method of counting. In fact, if people only had one big finger at the end of each arm, we might be counting in base-2 just like a computer - and what a horrifying sight I just put in your mind's eye.

Using base-2 numbers, a computer can represent any whole integer, provided there's enough memory to hold all the 1s and 0s. However, these values are indivisible. A computer can only ever represent data with one of these values. You can't have 3% of a 1 - in other words, you can't represent fractional numbers.
### Fractions Without Fraction
To get around this, computers use what's called floating-point arithmetic. Remember how we said computers interpret a series of 0s and 1s as a number? During floating-point arithmetic, computers interpret that same series of numbers as a math problem. A fixed number of those 1s and 0s, or bits, is interpreted as a whole number. Then, the computer interprets another portion in that same series of bits as an exponent. Since a computer can't store actual fractions, it stores the number in the form of scientific notation. Because of the limited amount of space a computer can use to store the scientific notation, the actual floating-point isn't guaranteed to be correct. It's only guaranteed to *probably* be close.

Tom Scott does an episode of Computerphile on this very problem, and explains the concept way better than I can. I just reread the last paragraph and it's kind of tortuous dumpster-fire. Go watch [this episode of Computerphile](https://www.youtube.com/watch?v=PZRI1IfStY0) and come back after Tom Scott does what Nin-Ten-Jason don't.

What the eloquent Mr. Scott and I are saying is, if you're working with money, and you're using floating-point numbers, you'll occasionally lose part of that money to rounding errors. In one transaction, that's no big deal. Across hundreds millions of transactions, like on the scale of Amazon.com, that can be a massive amount of money. That can be multiple engineers' salaries lost in rounding errors. You can also gain extra value, which means you can end up charging customers more money than the list price. That's not only a dick move, it's... probably illegal.

Even if floating-point numbers were 100% accurate all the time, you still run into a similar problem if you use rounding on floating-point numbers. You can neither charge nor pay someone less than one cent, so we have to do something with the remaining value less than one percent of a dollar. Let's see a concrete example.

Say your going to bill users biannually for a subscription, but the set price for the subscription is for the entire year. The price we'll say is $99.25 a year. To figure out what the user owes for half the year, you'd take `99.25 / 2` which gives you 49.625. That 5 at the end of our number represent half a cent. Since we can't charge a half a penny (we'll come back to this), we can try rounding the number. In JavaScript, what we'd do is this: 

```javascript
Math.round(100 * 49.625) / 100;
```

That gives us $49.63. So we'll charge the user $49.63 now, and $49.63 later in the year for their second installment.
 
Except, oops... `49.63 * 2` is $99.26. We just overcharged a consumer a penny, or what some people might call... stealing. Again, over one transaction this is only unfortunate, and you may get away with just an apology and a refund. In ten million transactions, though, [we would have stolen $100,000](https://en.wikipedia.org/wiki/Salami_slicing). Which while that is very exciting in its own way is also - you guessed it - an unrighteous-ly dick move.

That's an incredibly simplified version of the problem. If we expand the problem to something the scale of Netflix subscription billing, the problem can grow to nonsensical proportions. The price and amount of items sold would bear very little resemblance to actual amount of money the company would take in.

You might have already come to this conclusion, but we also can't use `Math.floor`. The business would lose a penny on each transaction, which over time and scale would lose the business a number of employees' salaries' worth of money. With enough scale, it can also negatively impact business and financial reports and projections.
## How Can We Solve The Problem
This problem can be solved, though, if we follow a few rules.
1. Only represent currency in its smallest possible denomination. In the case of the American dollar, that would be the cent, or the penny.
2. When the money must be divided, drop everything after the decimal point.
3. Have a documented plan for when to bill for decimal values we dropped in rule #2.

### Only represent currency in its smallest possible denomination
The  problem stems from the idea that the smallest amount of information on a computer, a bit, is indivisible. Common forms of currencies, though, which in the United States is the dollar, **is** divisible. You can divide a dollar into 4 quarters, which can be divided into a couple dimes and nickel, which can collectively be divided into 25 pennies. Pennies, though, cannot be divided any further. If we store all monetary values in denominations of pennies instead of dollars and fractions of dollars, we can represent the exact same information without risking losing money or overcharging because of rounding errors. 

While the [one cent coin itself might be an endangered species](https://www.npr.org/sections/money/2020/07/14/890435359/is-it-time-to-kill-the-penny), it's still the best way to hold a representation of money in computer memory.

### Drop the Decimal Points
If we're storing our number as a whole number of pennies, adding, subtracting, and multiplying that number will always give us a whole number of pennies. We won't get any of those pesky floating-point problems. The only time we can end up with a fractional number is if we divide our pennies.

It's very unlikely we can get away from having to divide our value. Even if there are no payment plans like in our earlier example, you'll likely have to generate financial reports of some kind. That's going to require dividing some amount of money by some other number... Somehow, the business end of whomever you're writing code for will want you to divide money. 

Dividing 73 cents in half leaves us with 36.5 cents. That's not a useful amount of money because we can't charge someone a one half of one cent, and we can't use one half of one cent when we're paying our bills. So we have get that number into a whole cent that we can actually charge or pay.

The thing is... we can actually ignore those fractional parts of pennies for now, because of rule number three. So just remember - unless rule number three says otherwise, we can `Math.floor` the result we get from dividing our pennies.

### Know What To Do With The Remainder
In step number two I asked you drop all decimal points. In the case of a payment plan, where the user is paying for a total value over the course of multiple payments, that means we'll lose some money. How much money? `totalAmount % numberOfPayments`. The remainder from dividing the total by the number of payments is number of pennies we would lose by always dropping the decimal values. 

So create a rule for when that remainder needs to be added back in. For instance, if you're writing software that allows for payments to be made in installments. You decide as a rule that all payments will be as equally divided as possible, but the remainder will be used for the very last installment. Or vice versa, the remainder could be added to the first installment. 

You can put it somewhere in the middle, maybe at the halfway point - if the number of installments is an odd number. The halfway point for an even number is always a float, and we literally just talked about this - get those garbage floats out of our money calculations!

When you have to calculate installments, make a plan for the remainder. That way we always charge and pay the amount we should.

If you get paid on a fixed salary, you might actually be able to see a real world example of this. Go back through your paystubs, check look all the stubs where for a single month. You might see the amounts aren't the same for each pay period. This isn't universally true for a number of reasons, but you may just be able to see your payroll company actively using their own rule to deal with when to payout the remainder.

## Caveats
I'm old enough to remember a time before CSS. In that long forgotten time, the `table` tag would be used to set the layout for webpages. When the majority of browsers finally allowed the use of CSS to style pages, there was a backlash against tables. They became a joke, and you wouldn't dare use them - even for tables of data. It was years before the scars had healed and table tags finally made their way back into our repertoire of semantic HTML tags.

So I want to make sure I point out - floating-point numbers are amazing and wildly useful. They are fast for certain types of complex calculations. If you need to calculate widths of UI components based on percentages, floats do an amazing job, and no one will care if you have a tiny rounding error. To the human eye, it's going to look perfect. In the case of money, though, the human wallet will definitely notice, so it's best we stick with integers and leave the floats for another day.
