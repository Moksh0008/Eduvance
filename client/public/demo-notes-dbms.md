# DBMS Study Notes - Normalization

## What is Normalization?
Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity.

## Why Normalize?
- Eliminate redundant data
- Ensure data dependencies make sense
- Prevent insertion, update, and deletion anomalies

## Normal Forms

### First Normal Form (1NF)
- Each column contains atomic (indivisible) values
- Each record is unique
- No repeating groups

### Second Normal Form (2NF)
- Must be in 1NF
- No partial dependencies (all non-key attributes depend on the entire primary key)

### Third Normal Form (3NF)
- Must be in 2NF
- No transitive dependencies (non-key attributes don't depend on other non-key attributes)

### Boyce-Codd Normal Form (BCNF)
- Must be in 3NF
- For every functional dependency X → Y, X must be a super key

## Functional Dependencies
- A functional dependency X → Y means X uniquely determines Y
- Example: StudentID → StudentName
- Armstrong's Axioms: Reflexivity, Augmentation, Transitivity

## Decomposition
- Lossless Join: Reconstructing the original relation without spurious tuples
- Dependency Preservation: All functional dependencies can be enforced
- Goal: Decompose into smaller relations while preserving information

## Example
Given R(A,B,C,D) with FDs: {A→B, B→C, C→D}
- Key: A
- BCNF? No, because B→C and B is not a super key
- Decompose into R1(A,B) and R2(B,C,D)
