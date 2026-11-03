---
title: Introduction to Cryptography
description: The all-in-one CTF Crypto handbook, covering attack techniques from classical ciphers to RSA, ECC, lattice cryptography and post-quantum cryptography.
---

# Introduction to Cryptography

> **The All-in-One CTF Crypto Handbook · From Classical to Quantum**

Cryptography (Crypto) is the CTF category that most tests your mathematical foundations. This article starts from classical ciphers and gradually covers symmetric cryptography, RSA, elliptic curves, hashes and MACs, cryptographic protocols, encoding and steganography, side channels, and post-quantum cryptography, while also collecting the common attack ideas and toolchains.

## Chapter 1: Attacks on Classical Ciphers

### 1.1 Substitution Ciphers

A substitution cipher is the most basic form of classical cipher. Its core idea is to replace each character of the plaintext with another character according to a fixed mapping rule. Depending on the substitution rule, it can be divided into two major categories: **monoalphabetic substitution** and **polyalphabetic substitution**.

#### 1.1.1 Caesar Cipher

The Caesar cipher is the simplest shift cipher: every letter of the alphabet is moved backward (or forward) by a fixed number of positions `k`. The encryption formula is: `C = (P + k) mod 26`, and the decryption formula is: `P = (C - k) mod 26`.

> 💡 **Attack method:** Since the key space contains only 25 possible shift values (k=1 to 25), the Caesar cipher can be broken instantly with a **brute-force attack**. For CTF challenges, simply trying all 25 shifts usually gives you the plaintext.

```python
# Brute-force a Caesar cipher in Python
for k in range(1, 26):
    plain = ''.join(
        chr((ord(c)-65-k)%26+65) if c.isupper() 
        else chr((ord(c)-97-k)%26+97) if c.islower() else c 
        for c in ciphertext
    )
    print(f"k={k}: {plain}")
```

#### 1.1.2 Affine Cipher

The affine cipher is an extension of the Caesar cipher that uses two keys, `a` and `b`. Encryption formula: `C = (a·P + b) mod 26`. It requires `gcd(a, 26) = 1`, that is, `a` must be coprime with 26.

> 💡 **Attack methods:**
> - **Brute force:** There are 12 valid values of `a` (1,3,5,7,9,11,15,17,19,21,23,25) and 26 values of `b`, so the total key space is only 312 — trivially brute-forceable.
> - **Known-plaintext attack:** If two plaintext-ciphertext pairs are known, you can set up a system of equations and solve for `a` and `b`.

#### 1.1.3 Monoalphabetic Substitution

The 26 letters are randomly mapped onto the 26 letters, giving a key space of `26! ≈ 4×10²⁶`. Although the key space is huge, the frequency characteristics of the plaintext are preserved, so it can be broken easily with **frequency analysis**.

> 💡 **Frequency analysis attack:**
> 1. Count how often each letter appears in the ciphertext.
> 2. Sort the ciphertext letters by frequency from highest to lowest.
> 3. Compare with the English letter frequency table (E≈12.7%, T≈9.1%, A≈8.2%, O≈7.5%, I≈7.0%, N≈6.7%) for an initial match.
> 4. Refine using bigram frequencies (such as TH, HE, IN, ER, AN) and trigram frequencies (such as THE, AND, THA, ENT).
> 5. Use contextual meaning to adjust by hand and gradually recover the complete plaintext.

### 1.2 Polyalphabetic Substitution Ciphers

#### 1.2.1 Vigenère Cipher

The Vigenère cipher uses a keyword (the key) to perform polyalphabetic substitution. During encryption the key is repeated cyclically, and each plaintext letter is Caesar-shifted by the letter at the corresponding key position. Encryption formula: `Cᵢ = (Pᵢ + Kᵢ) mod 26`.

> 💡 **Kasiski examination:** Look for repeated substrings in the ciphertext and compute the distances between them. The **greatest common divisor (GCD)** of those distances is very likely a multiple of the key length.

> 💡 **Index of Coincidence (IoC):**
> The index of coincidence measures the probability that two randomly chosen letters in a text are identical. English text has an IoC of about 0.067, while completely random text has an IoC of about 0.038.
> 
> Attack steps:
> 1. Guess the key length `L` and split the ciphertext into `L` columns.
> 2. Compute the IoC of each group; if it is close to 0.067, the guess is correct.
> 3. Perform frequency analysis on each group separately (equivalent to a monoalphabetic Caesar cipher) and solve for the shift of each position.

#### 1.2.2 Hill Cipher

A block cipher based on linear algebra: the plaintext is split into `n`-dimensional vectors, and an invertible `n×n` matrix is used as the key to perform a linear transformation.

> ⚠️ **Known-plaintext attack:** If `n` linearly independent `n`-dimensional plaintext-ciphertext pairs are known, you can build a matrix equation directly and solve for the key matrix. This is the most fatal weakness of the Hill cipher.

### 1.3 Transposition Ciphers

#### 1.3.1 Rail Fence Cipher

The plaintext is written in a zigzag pattern across `n` rows, and the ciphertext is then read row by row. The key is the number of rows `n`.

> 💡 **Attack:** Try all possible numbers of rows (the challenge usually gives a range or a hint) and reconstruct the plaintext directly.

#### 1.3.2 Columnar Transposition

The plaintext is written row by row into a matrix with a fixed number of columns, and then read out in the column order specified by the key. If the key is a numeric permutation, the columns are read in ascending order of the numbers.

> 💡 **Attack:** Try different numbers of columns and combine with language features (such as common word fragments) to probe. For short ciphertexts, you can brute-force all possible column permutations.

### 1.4 Quick Reference of Common CTF Classical Ciphers

| Cipher name | Characteristics | Attack method |
|---------|------|---------|
| Pigpen cipher | Symbol substitution, resembles pigpens | Table lookup substitution |
| Bacon cipher | 5-bit binary encoding, two fonts A/B | Identify font differences or the two states |
| Morse code | Combinations of dots and dashes | Table lookup translation |
| Keyboard cipher | Uses keyboard positions or shapes | Observe the keyboard layout |
| Pawnshop cipher | The number of "口" (mouth) strokes in Chinese characters | Count the "口" characters |
| Talking with Buddha about Zen | Encoding on a specific website | Use an online decoding tool |
| Core Values Encoding | Encoding with 12 words | Table lookup or online tool |
| Hundred Family Surnames Encoding | Surnames correspond to codes | Table lookup decoding |
| Atbash | First and last letters of the alphabet correspond | Fixed mapping substitution |
| ROT13 | Caesar cipher with shift 13 | Apply ROT13 again to decrypt |
| Polybius square | 5×5 coordinate encoding | Recover letters from coordinates |
| ADFGX/ADFGVX | WWI German cipher, combines substitution and transposition | Break the transposition first, then the substitution |
| Playfair | 5×5 matrix, digraph substitution | Frequency analysis + known plaintext |

## Chapter 2: Attacks on Symmetric Cryptography

### 2.1 Block Cipher Basics

A block cipher splits the plaintext into fixed-length blocks (such as 64 bits or 128 bits) and encrypts each block independently with a key. Common block ciphers include DES (64-bit blocks), 3DES, AES (128-bit blocks), and so on.

### 2.2 Attacks on Block Cipher Modes of Operation

#### 2.2.1 ECB Mode Attack (Electronic Codebook)

ECB mode is the simplest block cipher mode of operation: each plaintext block is encrypted independently. Its biggest weakness is: **identical plaintext blocks always produce identical ciphertext blocks**.

> ⚠️ **Attack techniques:**
> - **Pattern recognition:** If the plaintext contains repeated content, repeated blocks will also show up in the ciphertext, leaking structural information about the plaintext.
> - **Block substitution attack:** Without knowing the key, an attacker can replace block A in the ciphertext with block B, thereby replacing plaintext blocks after decryption. For example, replacing user A's encrypted balance block with user B's balance block.
> - **Reordering attack:** Reorder the ciphertext blocks, and the order of the plaintext blocks after decryption changes accordingly.

> ✅ **CTF example:** If a challenge provides an ECB encryption oracle that accepts arbitrary plaintext, you can construct plaintext blocks byte by byte and compare ciphertext blocks to recover the unknown plaintext one byte at a time (similar to a chosen-plaintext attack).

#### 2.2.2 CBC Mode Attack (Cipher Block Chaining)

In CBC mode, each plaintext block is XORed with the previous ciphertext block before encryption. The first block uses an initialization vector (IV). Encryption formula: `Cᵢ = E_K(Pᵢ ⊕ Cᵢ₋₁)`, decryption formula: `Pᵢ = D_K(Cᵢ) ⊕ Cᵢ₋₁`.

##### Padding Oracle Attack

When PKCS#7 padding is used, the last block after decryption is checked for valid padding. If the padding is invalid, the server may return a different error message ("padding error" vs. "decryption error").

> ⚠️ **How the attack works:**
> 1. The attacker intercepts the ciphertext `C = [IV, C₁, C₂, ..., Cₙ]`.
> 2. For the last ciphertext block `Cₙ`, construct an intermediate block `C'ₙ₋₁` such that the last byte of `D_K(Cₙ) ⊕ C'ₙ₋₁` becomes `0x01` (valid padding).
> 3. Iterate over the last byte of `C'ₙ₋₁` (256 possibilities) and observe the server response to find the value that makes the padding valid.
> 4. From this you can compute the last byte of `D_K(Cₙ)`.
> 5. Repeat the process to recover the entire plaintext byte by byte, without ever knowing the key!

```python
# Padding Oracle attack pseudocode
for byte_pos in reversed(range(block_size)):
    for guess in range(256):
        crafted = modify_iv_to_produce_padding(ciphertext, known_bytes, guess, byte_pos)
        if oracle(crafted) == "VALID_PADDING":
            known_bytes[byte_pos] = guess ^ padding_value
            break
```

##### CBC Bit Flipping Attack

Since `Pᵢ = D_K(Cᵢ) ⊕ Cᵢ₋₁`, flipping a bit in `Cᵢ₋₁` flips the corresponding bit in `Pᵢ`.

> 💡 **Attack:** If the attacker knows the content of a plaintext segment, they can flip the corresponding bits of the previous ciphertext block to precisely control what the next block decrypts to. This is often used to bypass authentication (for example, changing `"admin=false"` into `"admin=true"`).

#### 2.2.3 CTR Mode Attack (Counter Mode)

CTR mode turns a block cipher into a stream cipher, generating a keystream that is XORed with the plaintext. Encryption formula: `Cᵢ = Pᵢ ⊕ E_K(Nonce || Counterᵢ)`.

> ⚠️ **Attacks:**
> - **Nonce reuse:** If the same Nonce and key are used for two encryptions, then `C₁ ⊕ C₂ = P₁ ⊕ P₂`. If one of the plaintexts is known, the other can be recovered directly.
> - **Bit flipping:** As with stream ciphers, an attacker can flip bits of the ciphertext, which flips the corresponding bits of the plaintext.

#### 2.2.4 OFB / CFB Mode Attacks

OFB and CFB modes suffer from problems similar to CTR: keystream reuse leaks plaintext, and bit-flipping attacks are possible.

### 2.3 Stream Cipher Attacks

#### 2.3.1 Misuse of the One-Time Pad (OTP)

The OTP is theoretically perfectly secret, but only under the following conditions: the key is truly random, the key is at least as long as the plaintext, and the key is never reused.

> ⚠️ **Key reuse attack:** If two plaintexts `P₁` and `P₂` are encrypted with the same key `K`, then `C₁ ⊕ C₂ = P₁ ⊕ P₂`. Exploiting the redundancy of English text (such as the XOR characteristics of the space character), both plaintexts can be recovered.

#### 2.3.2 LFSR Attack

The linear feedback shift register (LFSR) is a core component of many stream ciphers. Because of the linear nature of LFSRs, a small number of known plaintext-ciphertext pairs is enough to recover the initial state by solving a linear system.

> 💡 **Berlekamp-Massey algorithm:** Given a binary sequence, this algorithm can find the shortest LFSR that generates that sequence in `O(n²)` time. If `2n` bits of keystream are known, the feedback polynomial of an `n`-stage LFSR can be recovered.

#### 2.3.3 RC4 Attacks

RC4 is a widely used stream cipher, but it has several statistical biases:
- **Initial byte bias:** The second keystream byte `S[1]` is biased toward 0 (probability about 1/128 instead of 1/256).
- **Fluhrer-Mantin-Shamir attack (FMS):** Exploits weaknesses of the IV in WEP, recovering the key by collecting packets with many specific IVs.
- **Bar Mitzvah attack:** Uses statistical weaknesses in the RC4 keystream to perform passive decryption.

### 2.4 Key-Related Attacks

#### 2.4.1 Meet-in-the-Middle Attack

Against double encryption `C = E_K₂(E_K₁(P))`, an attacker can:
1. Compute all possible `E_K₁(P)` and store them (table 1).
2. Compute all possible `D_K₂(C)` and store them (table 2).
3. Find the intersection of table 1 and table 2 to obtain `(K₁, K₂)`.

The time complexity drops from `O(|K|²)` to `O(|K|)`, with a space complexity of `O(|K|)`.

#### 2.4.2 Slide Attack

Targets round functions with a periodic structure (for example, the same subkey used in every round) and recovers the key by finding "slid pairs". It is suitable for ciphers with many rounds but weak round functions.

#### 2.4.3 Related-Key Attack

The attacker can obtain encryption results produced with different but related keys (for example, keys that differ by a known constant) and exploit the relationship between the keys to reduce the attack complexity.

### 2.5 AES-Specific Attacks

#### 2.5.1 AES Impossible Differential Attack

Exploits the fact that certain differential propagation paths in AES have probability 0, narrowing the set of key candidates by elimination.

#### 2.5.2 AES Cache Timing Attack

AES S-box lookups access lookup tables in memory. By measuring cache access times, the S-box indices can be inferred, and hence the key recovered.

## Chapter 3: The Complete Guide to RSA Public-Key Attacks

### 3.1 RSA Basics Review

The security of RSA is based on the difficulty of factoring large integers. Key generation:
1. Choose two large primes `p` and `q`, and compute `n = p × q`.
2. Compute the Euler totient `φ(n) = (p-1)(q-1)`.
3. Choose the public exponent `e` (usually 65537) such that `gcd(e, φ(n)) = 1`.
4. Compute the private key `d ≡ e⁻¹ mod φ(n)`.

Encryption: `C ≡ Mᵉ mod n`; decryption: `M ≡ Cᵈ mod n`.

### 3.2 Factorization Attacks

#### 3.2.1 Small Prime Factor Attack

If one factor of `n` is very small (for example, smaller than `10⁶`), it can be factored quickly by trial division.

```python
from sympy import factorint
n = ...  # given modulus
factors = factorint(n)  # automatically tries small factor factorization
```

#### 3.2.2 Fermat Factorization

When `p` and `q` are very close (that is, `|p-q|` is small), Fermat's method can be used:

`n = p×q = ((p+q)/2)² - ((p-q)/2)² = a² - b²`

Starting from `a = ⌈√n⌉` and incrementing, check whether `a² - n` is a perfect square.

```python
import gmpy2
n = ...
a = gmpy2.isqrt(n)
if a*a < n: a += 1
while not gmpy2.is_square(a*a - n):
    a += 1
b = gmpy2.isqrt(a*a - n)
p, q = a + b, a - b
```

#### 3.2.3 Pollard's p-1 Algorithm

If `p-1` has only small prime factors (that is, `p-1` is `B-smooth`), you can compute `a^(B!) mod n` and use the GCD to find a factor.

```python
def pollard_p1(n, B=10**5):
    a = 2
    for j in range(2, B):
        a = pow(a, j, n)
        d = gmpy2.gcd(a-1, n)
        if 1 < d < n:
            return d
    return None
```

#### 3.2.4 Pollard's Rho Algorithm

Uses Floyd's cycle-finding algorithm to find a collision in a pseudo-random sequence modulo `n`, with an expected time complexity of `O(n^(1/4))`.

```python
def pollard_rho(n):
    if n % 2 == 0: return 2
    x, y, c = 2, 2, 1
    f = lambda x: (pow(x, 2, n) + c) % n
    d = 1
    while d == 1:
        x = f(x)
        y = f(f(y))
        d = gmpy2.gcd(abs(x-y), n)
    return d if d != n else None
```

#### 3.2.5 ECM (Elliptic Curve Method)

For medium-sized factors (20-50 decimal digits), ECM is one of the most effective methods. It uses operations on elliptic curve groups to find factors.

#### 3.2.6 Quadratic Sieve (QS)

Suitable for factoring integers below 100 digits. It factors `n` by finding pairs that satisfy `x² ≡ y² mod n`.

#### 3.2.7 General Number Field Sieve (GNFS)

The fastest known classical integer factorization algorithm, suitable for large integers above 100 digits. Its time complexity is `L_n[1/3, c]`.

### 3.3 Small Public Exponent Attacks

#### 3.3.1 Small e Attack (e=3)

When `e=3` and `M³ < n`, the plaintext can be recovered directly by taking the cube root of the ciphertext: `M = ⌊C^(1/3)⌋`.

#### 3.3.2 Broadcast Attack (Håstad's Attack)

If the same plaintext `M` is encrypted with the same `e` and different moduli `n₁, n₂, ..., nₑ`, and `Mᵉ < n₁×n₂×...×nₑ`, the Chinese Remainder Theorem (CRT) can be used to recover `Mᵉ`, after which the `e`-th root is taken.

```python
from functools import reduce

def crt(moduli, remainders):
    total = 0
    prod = reduce(lambda a, b: a*b, moduli)
    for m, r in zip(moduli, remainders):
        p = prod // m
        total += r * pow(p, -1, m) * p
    return total % prod

M_e = crt([n1, n2, n3], [c1, c2, c3])
M = gmpy2.iroot(M_e, 3)[0]  # take the cube root
```

#### 3.3.3 Franklin-Reiter Related Message Attack

If two plaintexts `M₁` and `M₂` satisfy a linear relation `M₂ = f(M₁)` (such as `M₂ = a·M₁ + b`) and are encrypted with the same `(n, e)`, the plaintexts can be recovered directly when `e=3`.

#### 3.3.4 Coppersmith Attack

The Coppersmith method can find small roots modulo `n` in polynomial time.

> 💡 **Use cases:**
> - **Partial message leakage:** If the most significant or least significant bits of the plaintext are known, the remainder can be recovered.
> - **stereotyped messages:** If the plaintext has the format `M = pad || m` and `m` is small, `m` can be recovered.
> - **Low private exponent:** When `d < n^0.292`, the Boneh-Durfee extension can recover `d`.

```python
# Coppersmith with SageMath
# Assume M = known_prefix * 2^k + x is known, find the small root x
PR.<x> = PolynomialRing(Zmod(n))
f = (known_prefix * 2^k + x)^e - c
roots = f.small_roots(X=2^k, beta=1)
```

### 3.4 Private Key Recovery Attacks

#### 3.4.1 Wiener Attack

When the private key satisfies `d < n^0.25 / 3`, `d` can be recovered from the continued fraction expansion of `e/n`.

> 💡 **Principle:** `e/n ≈ e/φ(n) = k/d` (for some small integer `k`). Therefore `k/d` is a convergent of `e/n` and can be found with the continued fraction algorithm.

```python
from fractions import Fraction

def wiener_attack(e, n):
    cont = continued_fraction(e/n)
    convergents = cont.convergents()
    for k_d in convergents:
        k, d = k_d.numerator(), k_d.denominator()
        if k == 0: continue
        phi = (e*d - 1)//k
        s = n - phi + 1
        disc = s*s - 4*n
        if disc >= 0:
            sqrt_disc = gmpy2.isqrt(disc)
            if sqrt_disc*sqrt_disc == disc:
                p = (s + sqrt_disc)//2
                q = (s - sqrt_disc)//2
                if p*q == n:
                    return d, p, q
    return None
```

#### 3.4.2 Boneh-Durfee Attack

An extension of the Wiener attack, effective when `d < n^0.292`. It uses the lattice basis reduction (LLL) algorithm to find short vectors in a two-dimensional lattice.

### 3.5 Common Modulus and Common Factor Attacks

#### 3.5.1 Common Modulus Attack

If the same plaintext `M` is encrypted with the same `n` and coprime exponents `e₁, e₂` to give `C₁, C₂`, the extended Euclidean algorithm can be used to find `a, b` such that `a·e₁ + b·e₂ = 1`, and then `M = C₁ᵃ × C₂ᵇ mod n` is computed.

```python
def common_modulus_attack(c1, c2, e1, e2, n):
    g, a, b = extended_gcd(e1, e2)
    if a < 0:
        c1 = pow(c1, -1, n)
        a = -a
    if b < 0:
        c2 = pow(c2, -1, n)
        b = -b
    return (pow(c1, a, n) * pow(c2, b, n)) % n
```

#### 3.5.2 GCD Attack / Common Factor Attack

If several RSA moduli share one prime factor (such as `n₁ = p×q₁`, `n₂ = p×q₂`), then computing `gcd(n₁, n₂) = p` factors both.

```python
# Batch GCD attack (against many moduli)
def batch_gcd_attack(moduli):
    from math import gcd
    for i in range(len(moduli)):
        for j in range(i+1, len(moduli)):
            g = gcd(moduli[i], moduli[j])
            if g > 1:
                return i, j, g
    return None
```

### 3.6 Chosen Ciphertext Attacks

#### 3.6.1 Bleichenbacher Attack (PKCS#1 v1.5 Padding Oracle)

Targets RSA encryption using PKCS#1 v1.5 padding. If the server checks the padding format after decryption and returns a different error message when the format is invalid, an attacker can:
1. Choose a multiplier `s` and construct `C' = C × sᵉ mod n`.
2. Send `C'` to the server and observe whether it passes the padding check.
3. Use binary search to gradually narrow the interval containing the plaintext, eventually recovering it completely.

#### 3.6.2 ROBOT Attack

A modern variant of the Bleichenbacher attack, targeting implementations that use RSA key exchange in TLS. Discovered in 2017, it affected several mainstream TLS libraries.

### 3.7 Side-Channel and Implementation Attacks

#### 3.7.1 Timing Attack

Conditional branches in modular exponentiation (such as Montgomery reduction) make execution time depend on key bits. By precisely measuring decryption time, the private key `d` can be recovered bit by bit.

#### 3.7.2 Fault Injection Attack

By injecting voltage/clock/laser faults, computational errors are introduced into the modular exponentiation. For example, if one step of `Cᵈ mod n` goes wrong and yields `M'`, then `gcd(M - M', n)` may leak factor information.

#### 3.7.3 ROCA Attack (Return of Coppersmith's Attack)

Discovered in 2017: some hardware security keys (such as YubiKey) use a weak random number generator to generate RSA primes, giving the primes a specific structure. The Coppersmith method can then efficiently factor these weak keys.

### 3.8 Special Scenario Attacks

#### 3.8.1 Low Decryption Exponent and CRT

If the Chinese Remainder Theorem (CRT) is used to speed up decryption and one of the prime parameters is computed incorrectly, `p` and `q` can be recovered from a single faulty result.

#### 3.8.2 Partial Key Exposure Attack

If part of the bits of the private key `d` are known (such as half of the most significant bits), lattice methods can recover the full private key.

#### 3.8.3 RSA Blind Signature Attack

If the server performs RSA blind signatures on arbitrary messages (hashing the message before signing), an attacker can construct a special message that bypasses the hash check and obtain a valid signature on a malicious message.

## Chapter 4: Elliptic Curve Cryptography Attacks

### 4.1 ECC Basics

Elliptic Curve Cryptography (ECC) is based on the hardness of the elliptic curve discrete logarithm problem (ECDLP). Given points `P` and `Q = d·P` on an elliptic curve `E`, finding the integer `d` is hard.

### 4.2 Discrete Logarithm Attacks

#### 4.2.1 Baby-Step Giant-Step (BSGS)

Both the time complexity and the space complexity are `O(√n)`. Suitable for groups whose order is not too large.

```python
def bsgs(P, Q, order):
    m = int(gmpy2.isqrt(order)) + 1
    baby = {j*P: j for j in range(m)}
    mP = m * P
    for i in range(m):
        point = Q - i * mP
        if point in baby:
            return i * m + baby[point]
    return None
```

#### 4.2.2 Pollard's Rho for ECDLP

Uses a random walk on the elliptic curve to find collisions, with an expected time complexity of `O(√n)` but a space complexity of only `O(1)`.

#### 4.2.3 Pohlig-Hellman Algorithm

If the order `n` of the group can be factored into a product of small primes `n = p₁^e₁ × p₂^e₂ × ...`, the discrete logarithm can be solved separately in each subgroup and the results combined with the Chinese Remainder Theorem.

> ⚠️ **Key CTF point:** If the order of the elliptic curve is a smooth number — that is, all its prime factors are small — then Pohlig-Hellman can break ECDLP in polynomial time!

### 4.3 Weak Curve Attacks

#### 4.3.1 Anomalous Curve Attack

If the order of the elliptic curve is `#E(F_p) = p` (that is, the curve is anomalous), then ECDLP can be solved in polynomial time. Semaev, Satoh-Araki and Smart discovered this attack independently.

#### 4.3.2 MOV Attack (Menezes-Okamoto-Vanstone)

Using the Weil pairing or the Tate pairing, the discrete logarithm problem on the elliptic curve is mapped to the multiplicative group of a finite field. If the embedding degree `k` is small (such as `k ≤ 6`), index calculus can be used to solve the problem in the finite field, which is far easier than attacking ECDLP directly.

> ⚠️ **Defense:** In practice you should choose curves with a large embedding degree (for example, the standard curve secp256k1 has an embedding degree of about `10⁷⁵`).

#### 4.3.3 Singular Curve Attack

If the discriminant `Δ = 0`, the curve is singular and can be mapped onto an additive or multiplicative group, making ECDLP easy.

### 4.4 ECDSA Signature Attacks

#### 4.4.1 Nonce Reuse Attack

In ECDSA signatures, a different random number `k` must be used for every signature. If two signatures use the same `k`:

```
s₁ = k⁻¹(H(m₁) + r·d)
s₂ = k⁻¹(H(m₂) + r·d)
```

Subtracting the two equations eliminates `d`, directly yielding `k`, and hence the private key `d`.

```python
def ecdsa_nonce_reuse(r, s1, s2, h1, h2, n):
    k = ((h1 - h2) * pow(s1 - s2, -1, n)) % n
    d = ((s1 * k - h1) * pow(r, -1, n)) % n
    return k, d
```

#### 4.4.2 Nonce Bias Attack (Nonce Bias / Lattice Attack)

If some bits of `k` are known or `k` is biased (for example, generated by a biased random number generator), lattice methods (LLL) can recover the private key. For example, if the most significant bits of `k` are known, or `k` is below some threshold, a lattice can be constructed and the LLL algorithm applied.

#### 4.4.3 Signature Malleability

If `(r, s)` is a valid signature, then `(r, -s mod n)` is also valid. In some implementations this can lead to replay attacks.

### 4.5 ECC Implementation Attacks

#### 4.5.1 Missing Point Validation Attack

If an implementation does not verify that input points lie on the curve, an attacker can send points that are not on the curve and use the faulty point arithmetic to leak private key information (such as the Invalid Curve Attack).

#### 4.5.2 Small Subgroup Attack

Send low-order points to the server so that the shared secret is confined to a very small subgroup, which can be recovered by brute force.

## Chapter 5: Hash Function and MAC Attacks

### 5.1 Hash Function Attacks

#### 5.1.1 Collision Attack

Find two different messages `M₁ ≠ M₂` such that `H(M₁) = H(M₂)`. For an `n`-bit hash, the birthday attack has a complexity of about `2^(n/2)`.

> ⚠️ **MD5 collisions:** MD5 is a 128-bit hash, so its theoretical security strength should be 64 bits. However, Wang Xiaoyun found a practical MD5 collision method in 2004; today collisions can be generated within seconds.

#### 5.1.2 Length Extension Attack

Targets hashes with a Merkle-Damgård structure (such as MD5, SHA-1, SHA-256). If `H(secret || message)` and the length of `message` are known, `H(secret || message || padding || append)` can be computed without knowing `secret`.

> 💡 **Affected:** MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512
> **Not affected:** SHA-3 (Keccak), BLAKE2, HMAC

```python
# Length extension attack with hashpumpy
import hashpumpy
new_hash, new_data = hashpumpy.hashpump(
    original_hash, original_data, 
    data_to_append, key_length
)
```

#### 5.1.3 CTF Exploitation of Hash Length Extension

Commonly seen in custom MAC constructions: `MAC = H(secret || message)`. An attacker can:
1. Intercept a legitimate request `(message, MAC)`.
2. Construct a new message `message' = message || padding || evil_command`.
3. Compute the new `MAC'` without knowing `secret`.
4. The server verifies `MAC'` successfully and executes `evil_command`.

#### 5.1.4 Chosen-Prefix Collision Attack

Construct two messages `M₁` and `M₂` such that for any prefix `P`, `H(P || M₁) = H(P || M₂)`. Practical chosen-prefix collision tools exist for MD5 (such as HashClash).

### 5.2 MAC Attacks

#### 5.2.1 HMAC Security

HMAC is a secure MAC construction: `HMAC(K, M) = H((K' ⊕ opad) || H((K' ⊕ ipad) || M))`. It is not affected by length extension attacks.

#### 5.2.2 Timing Attack on MAC Comparison

If the server compares MACs byte by byte using `==` and returns failure early, the comparison time leaks the position of the first mismatching byte. An attacker can then guess the correct MAC byte by byte.

> ✅ **Defense:** Use a constant-time comparison function (such as `hmac.compare_digest` or `crypto.timing_safe_equal`).

#### 5.2.3 CBC-MAC Attacks

Plain CBC-MAC (CBC-encrypting the message and taking the last block) is vulnerable to several attacks:
- **Message extension:** If the MAC of `M` is `T`, then the MAC of `M || (T ⊕ M_next)` can be predicted.
- **Reordering attack:** Using the same key for CBC encryption and CBC-MAC creates serious security problems.

> ✅ **Secure variants:** CMAC, OMAC, PMAC, etc.

### 5.3 Password Hashing Attacks

#### 5.3.1 Rainbow Table Attack

Targets unsalted password hashes. By precomputing a large number of hash chains, space is traded for time, and hashes can be reversed within a short time.

> ✅ **Defense:** Use a random salt and slow hash functions (such as bcrypt, scrypt, Argon2).

#### 5.3.2 Timing Attack on Password Hash Comparison

Similar to the MAC timing attack: if password hash comparison is not constant-time, information may leak.

## Chapter 6: Cryptographic Protocol Attacks

### 6.1 Diffie-Hellman Key Exchange Attacks

#### 6.1.1 Small Subgroup Attack

The attacker sends low-order elements to one party so that the shared secret is confined to a small subgroup. If the implementation does not validate the order of the received element, the shared secret can be brute-forced.

#### 6.1.2 Logjam Attack

Discovered in 2015, this attack targets TLS connections that use 512-bit or weaker DH parameters. By precomputing discrete logarithms in a 512-bit prime field, the connection can be downgraded in real time and the session key recovered.

#### 6.1.3 Malicious Parameter Attack

If the attacker can control the DH parameters, they can choose a specially crafted `p` that makes the discrete logarithm easy to compute (for example, `p-1` has only small prime factors).

### 6.2 TLS/SSL Attacks

#### 6.2.1 BEAST Attack

Targets CBC mode in TLS 1.0. Exploiting the predictability of the IV (IV = previous ciphertext block), it recovers the Cookie byte by byte through a chosen-plaintext attack.

#### 6.2.2 CRIME Attack

Exploits a side effect of TLS compression (DEFLATE). The attacker controls part of the plaintext and, by observing changes in the compressed ciphertext length, recovers sensitive information (such as the Cookie) byte by byte.

#### 6.2.3 BREACH Attack

An HTTP-layer variant of CRIME, targeting HTTP response compression. Even if TLS compression is disabled, HTTP compression can still be exploited.

#### 6.2.4 POODLE Attack

A padding oracle against SSL 3.0. Exploiting the weakness that SSL 3.0 does not validate padding, it combines with JavaScript to decrypt sensitive data in HTTPS requests byte by byte.

#### 6.2.5 Heartbleed

Although primarily an implementation vulnerability, it is a serious problem in cryptographic protocol implementations. The OpenSSL heartbeat extension lacked bounds checking, allowing attackers to read sensitive information such as private keys and passwords from server memory.

### 6.3 Replay Attacks and Man-in-the-Middle Attacks

#### 6.3.1 Replay Attack

Intercept a legitimate message and send it again. Defenses include: timestamps, nonces, sequence numbers, and one-time tokens.

#### 6.3.2 Man-in-the-Middle Attack

The attacker intercepts and possibly modifies messages between two communicating parties. Without authentication (for example, using only DH without verifying public keys), the connection is vulnerable to MITM attacks.

### 6.4 Zero-Knowledge Proof Attacks

#### 6.4.1 Improper Use of the Fiat-Shamir Heuristic

If, when converting an interactive zero-knowledge proof into a non-interactive one, the challenge value is fixed or predictable rather than computed by hashing, an attacker can forge proofs.

## Chapter 7: Encoding, Steganography and Miscellaneous

### 7.1 The Encoding Family

#### 7.1.1 The Base Series

| Encoding | Characteristics | How to identify |
|------|------|---------|
| Base64 | A-Z, a-z, 0-9, +/, = padding | Common, ends with = |
| Base32 | A-Z, 2-7, = padding | All uppercase or digits |
| Base16 (Hex) | 0-9, A-F | Pure hexadecimal |
| Base58 | Bitcoin addresses, no 0/O/I/l | No similar-looking characters |
| Base85 (Ascii85) | Characters such as !, -, ~ | Wrapped in <~ ~> |
| Base91 | Extended ASCII character set | More compact |
| Base100 | Emoji | All emoji |

#### 7.1.2 URL Encoding / HTML Entity Encoding

URL encoding uses the `%XX` format, while HTML entities use `&#DD;` or `&name;`.

#### 7.1.3 Unicode Steganography

- **Zero-width characters:** Zero-width space (U+200B), zero-width non-joiner (U+200C), and zero-width joiner (U+200D) can be used to hide information.
- **Homoglyphs:** Different Unicode characters with similar glyphs (such as Cyrillic а vs. Latin a).
- **Invisible characters:** Control characters such as the right-to-left mark (U+202E).

### 7.2 Steganography

#### 7.2.1 LSB Steganography (Least Significant Bit)

Information is hidden in the least significant bits of image pixel values. For a 24-bit BMP image, each pixel can hide 3 bits of information.

> 💡 **Detection:** Chi-Square test, RS analysis, visual attack (inspect the LSB plane).

#### 7.2.2 Audio Steganography

- **LSB audio:** Similar to image LSB, modifies the least significant bit of sample values.
- **Spectral steganography:** Embeds information in the frequency domain, modifying coefficients after an FFT/DFT transform.
- **Echo steganography:** Encodes information by introducing echoes.

#### 7.2.3 File Format Steganography

- **Appended data:** Append data to the end of a file (such as a zip appended after an image).
- **File concatenation:** Exploit the tolerance of file formats to construct multi-format files.
- **EXIF data:** Hide information in the metadata of an image.

### 7.3 Common CTF Encoding Puzzles

#### 7.3.1 Manchester Encoding / Differential Manchester

Line codes used in digital communication; in CTF they may appear as waveforms or binary sequences.

#### 7.3.2 Identifying Line Codes

| Encoding | Characteristics |
|------|------|
| NRZ | High = 1, low = 0 |
| NRZI | Level transition = 1, no transition = 0 |
| Manchester | Rising edge = 0, falling edge = 1 (or the reverse) |
| Differential Manchester | Transition at the start of a bit = 0, no transition = 1 |

#### 7.3.3 Base Conversion and Custom Encodings

CTF challenges often feature custom bases or mixed encodings, such as:
- Converting a string to binary and re-grouping it for interpretation.
- Substituting with a non-standard character set.
- Multi-layer nested encoding (such as Base64 → Hex → Base32 → ...).

## Chapter 8: Side Channels and Implementation Attacks

### 8.1 Timing Attack

Key information is inferred by precisely measuring the execution time of operations. It was first proposed by Kocher in 1996.

#### 8.1.1 Square-and-Multiply Modular Exponentiation Timing Attack

In the square-and-multiply algorithm for modular exponentiation, a multiplication is performed when the key bit is 1 and skipped when it is 0. By measuring the timing difference, the key can be recovered bit by bit.

> ✅ **Defense:** Constant-time algorithms (always square-and-multiply), Montgomery ladder, blinding techniques.

### 8.2 Cache Attack

#### 8.2.1 Flush+Reload

Exploits the shared nature of CPU caches. The attacker:
1. Flushes the target memory line out of the cache.
2. Waits for the target process to execute.
3. Reloads and measures the access time. If it is short, the target process accessed that memory line.

#### 8.2.2 Prime+Probe

The attacker fills a cache set with their own data (prime), waits for the target to execute, and then measures the time to re-access their own data (probe). A longer time means the target accessed that cache set.

### 8.3 Power Analysis

#### 8.3.1 Simple Power Analysis (SPA)

Directly observe the power trace to identify different operations (such as multiplication vs. addition). With SPA, the key bits of RSA's square-and-multiply algorithm are clearly visible.

#### 8.3.2 Differential Power Analysis (DPA)

Collect a large number of power traces and use statistical methods (such as differencing) to extract key-related information. It works effectively even with a lot of noise.

### 8.4 Fault Injection

#### 8.4.1 Voltage/Clock Glitching

Momentarily changing the supply voltage or clock frequency causes the processor to skip instructions or produce incorrect results.

#### 8.4.2 RSA Fault Attack

If, during CRT-RSA decryption, the computation modulo one prime goes wrong (such as `m_p` correct but `m_q` wrong), the faulty result `m'` satisfies `m' ≡ m mod p` but `m' ≢ m mod q`, so `gcd(m'ᵉ - c, n)` can leak factor information.

#### 8.4.3 AES Fault Attack

Injecting a fault into the last round of AES can recover the last round subkey. By injecting faults into specific rounds, all round keys can be recovered round by round.

## Chapter 9: Post-Quantum Cryptography and Frontier Attacks

### 9.1 The Threat of Quantum Computing to Cryptography

#### 9.1.1 Shor's Algorithm

A quantum algorithm that can solve integer factorization and discrete logarithm problems in polynomial time. For an `n`-bit integer, Shor's algorithm requires about `O(n³)` quantum gate operations and `O(n)` qubits.

> ⚠️ **Impact:** All cryptosystems based on integer factorization or discrete logarithms, such as RSA, DSA, ECDSA, ECDH, DH.

#### 9.1.2 Grover's Algorithm

A quantum search algorithm that can reduce the complexity of brute-force search from `O(N)` to `O(√N)`. For symmetric ciphers, this means the effective key length is halved (for example, AES-256 drops to the AES-128 level).

### 9.2 Post-Quantum Cryptography (PQC)

#### 9.2.1 Lattice-Based Cryptography

Based on hard lattice problems: the Shortest Vector Problem (SVP) and the Closest Vector Problem (CVP). Representative algorithms: NTRU, Kyber, Dilithium.

> 💡 **Lattice attacks:** The LLL algorithm and the BKZ algorithm are used for lattice basis reduction. In CTF you may encounter the Hidden Number Problem (HNP) or approximate CVP problems in low-dimensional lattices.

#### 9.2.2 Code-Based Cryptography

Based on hard problems in error-correcting codes. Representative algorithms: McEliece, Classic McEliece.

#### 9.2.3 Multivariate Cryptography

Based on the hardness of solving systems of multivariate quadratic equations over finite fields. Representative algorithms: Rainbow, UOV.

#### 9.2.4 Hash-Based Signatures

Based on the security of hash functions. Representative algorithms: Lamport, Winternitz, SPHINCS+.

### 9.3 Lattice Attacks in CTF

#### 9.3.1 Hidden Number Problem (HNP)

Given `tᵢ` and `MSB_k(tᵢ·x mod p)`, recover `x`. This can be transformed into a CVP problem on a lattice.

#### 9.3.2 Lattice Attacks on ECDSA

If the nonce `k` in ECDSA signatures is biased (for example, its most significant bits are known), a lattice can be constructed and LLL used to recover the private key.

```python
# SageMath: ECDSA nonce bias lattice attack
# Assume the (h, r, s) of several signatures are known and some bits of k are known
M = Matrix(ZZ, [...])  # build the lattice
L = M.LLL()
# the short vectors contain private key information
```

### 9.4 Homomorphic Encryption Attacks

#### 9.4.1 Noise Management Attack

Somewhat homomorphic encryption (such as Paillier) and fully homomorphic encryption (FHE) rely on noise management. If the noise grows beyond the threshold, the decryption result will be incorrect.

#### 9.4.2 Key Recovery Attack

Some homomorphic encryption schemes may have key recovery vulnerabilities under certain parameter choices.

## Chapter 10: CTF Practical Toolchain and Quick Reference

### 10.1 Essential Tools

| Tool | Purpose | Link/Command |
|------|------|----------|
| SageMath | Mathematical computation, lattice basis reduction, number theory | sage |
| Python + gmpy2 | Large integer arithmetic, modular arithmetic | pip install gmpy2 |
| PyCryptodome | Cryptography library | pip install pycryptodome |
| openssl | Certificates, encryption and decryption | openssl |
| hashcat | Password hash cracking | hashcat |
| John the Ripper | Password cracking | john |
| zsteg | PNG/BMP LSB steganography | gem install zsteg |
| steghide | Audio/image steganography | steghide |
| binwalk | File extraction and analysis | binwalk -e file |
| foremost | File recovery | foremost -i file |
| RsaCtfTool | Automated RSA attacks | github.com/Ganapati/RsaCtfTool |
| factordb | Online factor database | factordb.com |
| Alpertron ECM | Online integer factorization | alpertron.com.ar/ECM.HTM |
| CyberChef | All-purpose encoding conversion tool | gchq.github.io/CyberChef |
| hashpumpy | Hash length extension attack | pip install hashpumpy |
| pwntools | CTF interaction and exploitation | pip install pwntools |

### 10.2 RSA Attack Decision Tree

```
Given n, e, c:
│
├─ Can n be factored?
│  ├─ Yes → compute φ(n) directly, find d, decrypt
│  └─ No → continue
│
├─ Is e small? (such as e=3)
│  ├─ Yes → try direct root extraction, broadcast attack, Franklin-Reiter
│  └─ No → continue
│
├─ Are there multiple (n,e) pairs where the n share a common factor?
│  ├─ Yes → GCD attack to factor n
│  └─ No → continue
│
├─ Is k/d among the continued fraction convergents of e/n?
│  ├─ Yes → Wiener attack
│  └─ No → continue
│
├─ Is part of the plaintext known?
│  ├─ Yes → Coppersmith method
│  └─ No → continue
│
├─ Is there a Padding Oracle?
│  ├─ Yes → Bleichenbacher attack
│  └─ No → more advanced lattice methods may be required
```

### 10.3 Quick Reference of Common CTF Crypto Challenge Types

| Challenge characteristics | Attack idea | Tool/Script |
|---------|---------|----------|
| A ciphertext with a hint about classical ciphers | Frequency analysis, Kasiski, IoC | Python script |
| Given n, e, c with a very small e | Small-e attack, broadcast attack | gmpy2.iroot, crt |
| Multiple n values given | GCD attack, common modulus attack | math.gcd |
| Given e, n with a very large e | Wiener attack, Boneh-Durfee | SageMath + LLL |
| An encryption Oracle is provided | Padding Oracle, chosen plaintext | pwntools |
| A hash value with a hint about length extension | Length extension attack | hashpumpy |
| An image/audio file is provided | LSB, spectrum, EXIF, appended data | zsteg, binwalk, steghide |
| ECC parameters and points are provided | BSGS, Pohlig-Hellman, MOV | SageMath |
| ECDSA signature pairs are provided | Nonce reuse, lattice attack | SageMath |
| Multi-layer encoding | Decode layer by layer | CyberChef |

### 10.4 Python Quick Reference Snippets

#### 10.4.1 Extended Euclidean Algorithm

```python
def egcd(a, b):
    if a == 0:
        return (b, 0, 1)
    else:
        g, y, x = egcd(b % a, a)
        return (g, x - (b // a) * y, y)

def modinv(a, m):
    g, x, y = egcd(a, m)
    if g != 1:
        raise Exception('modular inverse does not exist')
    else:
        return x % m
```

#### 10.4.2 Chinese Remainder Theorem

```python
def crt(a, m):
    # a: list of remainders, m: list of moduli
    from functools import reduce
    M = reduce(lambda x, y: x*y, m)
    result = 0
    for ai, mi in zip(a, m):
        Mi = M // mi
        result += ai * Mi * pow(Mi, -1, mi)
    return result % M
```

#### 10.4.3 Quick Factorization Attempts

```python
from sympy import factorint, isprime
from gmpy2 import isqrt, gcd

def factor_small(n):
    # trial division for small factors
    for p in [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]:
        while n % p == 0:
            return p
    return None

def fermat_factor(n):
    a = isqrt(n) + 1
    b2 = a*a - n
    while not is_square(b2):
        a += 1
        b2 = a*a - n
    b = isqrt(b2)
    return (a+b, a-b)
```

#### 10.4.4 Basic Elliptic Curve Operations (SageMath)

```python
# define the curve
p = ...  # prime field
a, b = ..., ...  # curve parameters
E = EllipticCurve(GF(p), [a, b])

# define a point
P = E(x, y)
n = P.order()  # order of the point

# BSGS
Q = d*P  # known
k = discrete_log(Q, P, operation='+')
```

## Conclusion

> 🎯 Cryptography attacks are a constantly evolving field. From frequency analysis of classical ciphers to lattice-based attacks on modern RSA, and on to the paradigm shift brought by quantum computing, every attack technique reveals a potential weakness in a cryptographic implementation. In CTF competitions, mastering these attack techniques not only helps you solve challenges quickly, but also gives you a deeper understanding of the design principles and security boundaries of cryptography.
>
> **Remember:** The best defense is understanding the attack. Only by thoroughly mastering attack techniques can you design truly secure cryptographic systems.
>
> *— Good luck on the CTF battlefield! 🏁*
