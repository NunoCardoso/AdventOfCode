there are three types

e => B C
A => B C

A => B Rn C Ar           or A => B ( C )
A => B Rn C Y D Ar       or A => B ( C , D )
A => B Rn C Y D Y E Ar   or A => B ( C , D, E )

the generic is A => B C, so a step is used to get two molecules from one molecule, except
the ones with Rn, Y and Ar, which do not really do nothing, they are subproducts of a step

so, for things like ABC => DE => F, we get 2 steps from 3 molecules, 10 steps from 11 molecules, etc.

* steps = count(molecules) - 1

for A => B ( C ) is kind of the same as A => B C, in the sense that ( and ) do not add a step count

so, A(B(C(D(E)))) => ABCDE (or ABCDE => A(B(C(D(E))))), we already establish that it is

* steps = count(molecules) - 1

So, a match of Rn or Ar does not affect step count.

for X => B Rn C Y D Ar ( or X => B ( C , D ) ) that uses one step.

A(B(C(D,E),F),G) => A(B(X,F),G) => A(Y, G) => Z

3 steps, as in molecules - commas - 1  => 3 steps

for X => B Rn C Y D Y E Ar (X => B ( C, D, E ) ) that uses one step

A(B(C(D,E,F),G,H),I,J) => A(B(X,G,H),I,J) => A(Y,I,J) => Z

3 steps, as in molecules - commas - 1  => 10 - 6 - 1 => 3 steps

so, count molecules. count commas.

A(B(C(D,E(F,G),K),L(M,N),O),P) =>
A(B(C(D,E(F,G),K),\1,O),P) =>
A(B(C(D,\2,K),\1,O),P) =>
A(B(\3,\1,O),P) =>
A(\4,P) =>
\5

5 steps

13 - 7 - 1
