---
title: 密码学入门
description: CTF Crypto 万能手册，从古典密码到 RSA、ECC、格密码与后量子密码的攻击手段全收录。
---

# 密码学入门

> **CTF Crypto 万能手册 · 从古典到量子**

密码学（Crypto）是 CTF 中最考验数学功底的方向。本文从古典密码出发，逐步覆盖对称密码、RSA、椭圆曲线、哈希与 MAC、密码协议、编码隐写、侧信道以及后量子密码，并整理常用攻击思路与工具链。

## 第一章：古典密码学攻击

### 1.1 替换密码（Substitution Cipher）

替换密码是古典密码中最基础的形式，其核心思想是将明文中的每个字符按照固定的映射规则替换为另一个字符。根据替换规则的不同，可分为**单表替换**和**多表替换**两大类。

#### 1.1.1 凯撒密码（Caesar Cipher）

凯撒密码是最简单的移位密码，将字母表中的每个字母向后（或向前）移动固定的位数 `k`。加密公式为：`C = (P + k) mod 26`，解密公式：`P = (C - k) mod 26`。

> 💡 **攻击方法：** 由于密钥空间仅有 25 个可能的移位值（k=1 到 25），凯撒密码可以通过**穷举攻击（Brute Force）**在瞬间破解。对于CTF题目，通常直接尝试所有25种移位即可得到明文。

```python
# Python 穷举凯撒密码
for k in range(1, 26):
    plain = ''.join(
        chr((ord(c)-65-k)%26+65) if c.isupper() 
        else chr((ord(c)-97-k)%26+97) if c.islower() else c 
        for c in ciphertext
    )
    print(f"k={k}: {plain}")
```

#### 1.1.2 仿射密码（Affine Cipher）

仿射密码是凯撒密码的扩展，使用两个密钥 `a` 和 `b`。加密公式：`C = (a·P + b) mod 26`。要求 `gcd(a, 26) = 1`，即 `a` 必须与26互质。

> 💡 **攻击方法：**
> - **穷举攻击：** 满足条件的 `a` 有12个取值（1,3,5,7,9,11,15,17,19,21,23,25），`b` 有26个取值，总密钥空间仅312种，极易穷举。
> - **已知明文攻击：** 若已知两个明密文对，可建立方程组求解 `a` 和 `b`。

#### 1.1.3 单表替换密码（Monoalphabetic Substitution）

将26个字母随机映射到26个字母上，密钥空间为 `26! ≈ 4×10²⁶`。虽然密钥空间巨大，但由于保留了明文的频率特征，可以通过**频率分析**轻松破解。

> 💡 **频率分析攻击（Frequency Analysis）：**
> 1. 统计密文中每个字母的出现频率。
> 2. 将密文字母按频率从高到低排序。
> 3. 对照英语字母频率表（E≈12.7%, T≈9.1%, A≈8.2%, O≈7.5%, I≈7.0%, N≈6.7%）进行初步匹配。
> 4. 结合双字母组合（bigram）频率（如 TH, HE, IN, ER, AN）和三字母组合（trigram）频率（如 THE, AND, THA, ENT）进行精修。
> 5. 利用上下文语义进行人工调整，逐步还原完整明文。

### 1.2 多表替换密码

#### 1.2.1 维吉尼亚密码（Vigenère Cipher）

维吉尼亚密码使用一个关键词（密钥）进行多表替换。加密时，密钥循环重复，每个明文字母使用密钥对应位置的字母进行凯撒移位。加密公式：`Cᵢ = (Pᵢ + Kᵢ) mod 26`。

> 💡 **Kasiski 检验法：** 在密文中寻找重复的字符串片段，计算它们之间的距离。这些距离的**最大公约数（GCD）**很可能是密钥长度的倍数。

> 💡 **重合指数法（Index of Coincidence, IoC）：**
> 重合指数是衡量文本中随机选取两个字母相同概率的指标。英语文本的IoC约为0.067，完全随机文本的IoC约为0.038。
> 
> 攻击步骤：
> 1. 猜测密钥长度 `L`，将密文按列分成 `L` 组。
> 2. 计算每组的IoC，若接近0.067则猜测正确。
> 3. 对每组分别进行频率分析（相当于单表凯撒），求解每位的移位量。

#### 1.2.2 希尔密码（Hill Cipher）

基于线性代数的分组密码，将明文分成 `n` 维向量，使用 `n×n` 的可逆矩阵作为密钥进行线性变换。

> ⚠️ **已知明文攻击：** 若已知 `n` 个线性无关的 `n` 维明密文对，可直接构造矩阵方程求解密钥矩阵。这是希尔密码最致命的弱点。

### 1.3 置换密码（Transposition Cipher）

#### 1.3.1 栅栏密码（Rail Fence Cipher）

将明文按"之"字形（zigzag）排列在 `n` 行上，然后按行读取得到密文。密钥为行数 `n`。

> 💡 **攻击：** 尝试所有可能的行数（通常题目会给出范围或暗示），直接重构明文。

#### 1.3.2 列置换密码（Columnar Transposition）

将明文按行写入一个固定列数的矩阵，然后按照密钥指定的列顺序读取。若密钥为数字排列，则按数字大小顺序读取各列。

> 💡 **攻击：** 尝试不同的列数，结合语言特征（如常见单词片段）进行试探。对于短密文，可以穷举所有可能的列排列。

### 1.4 CTF 常见古典密码速查

| 密码名称 | 特征 | 攻击方法 |
|---------|------|---------|
| 猪圈密码（Pigpen） | 符号替换，形似猪圈 | 查表替换 |
| 培根密码（Bacon） | 5位二进制编码，A/B 两种字体 | 识别字体差异或两种状态 |
| 摩斯电码（Morse） | 点划组合 | 查表翻译 |
| 键盘密码 | 利用键盘位置或形状 | 观察键盘布局 |
| 当铺密码 | 汉字笔画中"口"的数量 | 数"口"字数量 |
| 与佛论禅 | 特定网站编码 | 使用在线解码工具 |
| 核心价值观编码 | 12个词编码 | 查表或在线工具 |
| 百家姓编码 | 姓氏对应编码 | 查表解码 |
| 埃特巴什码（Atbash） | 字母表首尾对应 | 固定映射替换 |
| ROT13 | 移位13的凯撒密码 | 再次ROT13即可解密 |
| Polybius 方阵 | 5×5 坐标编码 | 根据坐标还原字母 |
| ADFGX/ADFGVX | 一战德军密码，结合替换和置换 | 先破解置换再破解替换 |
| Playfair | 5×5 矩阵，双字母替换 | 频率分析+已知明文 |

## 第二章：对称密码学攻击

### 2.1 分组密码基础

分组密码将明文分成固定长度的块（如64位或128位），使用密钥对每个块独立加密。常见的分组密码包括 DES（64位块）、3DES、AES（128位块）等。

### 2.2 分组密码工作模式攻击

#### 2.2.1 ECB 模式攻击（Electronic Codebook）

ECB 模式是最简单的分组密码工作模式，每个明文块独立加密。其最大弱点是：**相同的明文块总是产生相同的密文块**。

> ⚠️ **攻击手段：**
> - **模式识别：** 若明文中有重复内容，密文中也会出现重复块，泄露明文结构信息。
> - **块替换攻击：** 攻击者可以在不知道密钥的情况下，将密文中的块A替换为块B，从而在解密时实现明文块的替换。例如，将用户A的加密余额块替换为用户B的余额块。
> - **重排攻击：** 重排密文块的顺序，解密后明文的块顺序也会相应改变。

> ✅ **CTF 实例：** 若题目给出 ECB 加密的 Oracle，且允许提交任意明文，可以逐字节构造明文块，通过比对密文块来逐字节恢复未知明文（类似选择明文攻击）。

#### 2.2.2 CBC 模式攻击（Cipher Block Chaining）

CBC 模式中，每个明文块在加密前与前一个密文块进行异或。第一块使用初始化向量（IV）。加密公式：`Cᵢ = E_K(Pᵢ ⊕ Cᵢ₋₁)`，解密公式：`Pᵢ = D_K(Cᵢ) ⊕ Cᵢ₋₁`。

##### Padding Oracle 攻击

当使用 PKCS#7 填充时，解密后的最后一个块会检查填充是否合法。若填充不合法，服务器可能返回不同的错误信息（如"填充错误"vs"解密错误"）。

> ⚠️ **攻击原理：**
> 1. 攻击者截获密文 `C = [IV, C₁, C₂, ..., Cₙ]`。
> 2. 针对最后一个密文块 `Cₙ`，构造中间块 `C'ₙ₋₁`，使得 `D_K(Cₙ) ⊕ C'ₙ₋₁` 的最后一个字节为 `0x01`（合法填充）。
> 3. 通过遍历 `C'ₙ₋₁` 的最后一个字节（256种可能），观察服务器响应，找到使填充合法的那个值。
> 4. 由此可计算出 `D_K(Cₙ)` 的最后一个字节。
> 5. 重复此过程，逐字节恢复整个明文，无需知道密钥！

```python
# Padding Oracle 攻击伪代码
for byte_pos in reversed(range(block_size)):
    for guess in range(256):
        crafted = modify_iv_to_produce_padding(ciphertext, known_bytes, guess, byte_pos)
        if oracle(crafted) == "VALID_PADDING":
            known_bytes[byte_pos] = guess ^ padding_value
            break
```

##### CBC 比特翻转攻击（Bit Flipping Attack）

由于 `Pᵢ = D_K(Cᵢ) ⊕ Cᵢ₋₁`，修改 `Cᵢ₋₁` 的某个比特，会导致 `Pᵢ` 对应比特翻转。

> 💡 **攻击：** 若攻击者知道某段明文的内容，可以通过翻转前一个密文块的对应比特，精确控制下一块解密后的内容。常用于绕过身份验证（如将 `"admin=false"` 改为 `"admin=true"`）。

#### 2.2.3 CTR 模式攻击（Counter Mode）

CTR 模式将分组密码转换为流密码，生成密钥流与明文异或。加密公式：`Cᵢ = Pᵢ ⊕ E_K(Nonce || Counterᵢ)`。

> ⚠️ **攻击：**
> - **Nonce 重用：** 若两次加密使用相同的 Nonce 和密钥，则 `C₁ ⊕ C₂ = P₁ ⊕ P₂`。若知道其中一个明文，可直接求出另一个明文。
> - **比特翻转：** 与流密码一样，攻击者可以翻转密文比特，导致明文对应比特翻转。

#### 2.2.4 OFB / CFB 模式攻击

OFB 和 CFB 模式也存在与 CTR 类似的问题：密钥流重用会导致明文泄露，且支持比特翻转攻击。

### 2.3 流密码攻击

#### 2.3.1 一次性密码本（One-Time Pad, OTP）的误用

OTP 在理论上具有完美保密性，但前提是：密钥真正随机、密钥长度不小于明文、密钥绝不重用。

> ⚠️ **密钥重用攻击：** 若两个明文 `P₁` 和 `P₂` 使用相同密钥 `K` 加密，则 `C₁ ⊕ C₂ = P₁ ⊕ P₂`。利用英语文本的冗余性（如空格字符的XOR特征），可以恢复两个明文。

#### 2.3.2 LFSR 攻击

线性反馈移位寄存器（LFSR）是许多流密码的核心组件。由于 LFSR 的线性特性，已知少量明文-密文对即可通过解线性方程组恢复初始状态。

> 💡 **Berlekamp-Massey 算法：** 给定一个二进制序列，该算法可以在 `O(n²)` 时间内找到最短的 LFSR 来生成该序列。若已知 `2n` 位密钥流，即可恢复 `n` 级 LFSR 的反馈多项式。

#### 2.3.3 RC4 攻击

RC4 是广泛使用的流密码，但存在多种统计偏差：
- **初始字节偏差：** 密钥流的第二个字节 `S[1]` 有偏向0的倾向（概率约1/128而非1/256）。
- **Fluhrer-Mantin-Shamir 攻击（FMS）：** 针对WEP中IV的弱点，通过收集大量特定IV的数据包恢复密钥。
- **Bar Mitzvah 攻击：** 利用RC4密钥流的统计弱点进行被动解密。

### 2.4 密钥相关攻击

#### 2.4.1 中间相遇攻击（Meet-in-the-Middle）

针对双重加密 `C = E_K₂(E_K₁(P))`，攻击者可以：
1. 计算所有可能的 `E_K₁(P)` 并存储（表1）。
2. 计算所有可能的 `D_K₂(C)` 并存储（表2）。
3. 寻找表1和表2的交集，得到 `(K₁, K₂)`。

时间复杂度从 `O(|K|²)` 降低到 `O(|K|)`，空间复杂度为 `O(|K|)`。

#### 2.4.2 滑动攻击（Slide Attack）

针对具有周期性的轮函数（如每轮使用相同子密钥），通过寻找"滑动对"来恢复密钥。适用于轮数很多但轮函数弱的密码。

#### 2.4.3 相关密钥攻击（Related-Key Attack）

攻击者可以获取使用不同但相关密钥（如密钥相差一个已知常量）加密的结果，利用密钥之间的关系降低攻击复杂度。

### 2.5 AES 特定攻击

#### 2.5.1 AES 不可能差分攻击

利用AES中某些差分传播路径的概率为0的特性，通过排除法缩小密钥候选范围。

#### 2.5.2 AES 缓存时序攻击

AES的S盒查找操作会访问内存中的查找表。通过测量缓存访问时间，可以推断出S盒的索引，进而恢复密钥。

## 第三章：RSA 公钥密码攻击大全

### 3.1 RSA 基础回顾

RSA 的安全性基于大整数分解的困难性。密钥生成：
1. 选择两个大素数 `p` 和 `q`，计算 `n = p × q`。
2. 计算欧拉函数 `φ(n) = (p-1)(q-1)`。
3. 选择公钥指数 `e`（通常取65537），满足 `gcd(e, φ(n)) = 1`。
4. 计算私钥 `d ≡ e⁻¹ mod φ(n)`。

加密：`C ≡ Mᵉ mod n`；解密：`M ≡ Cᵈ mod n`。

### 3.2 因数分解攻击

#### 3.2.1 小素数因子攻击

若 `n` 的一个因子很小（如小于 `10⁶`），可以通过试除法快速分解。

```python
from sympy import factorint
n = ...  # 给定的模数
factors = factorint(n)  # 自动尝试小因子分解
```

#### 3.2.2 Fermat 分解法

当 `p` 和 `q` 非常接近时（即 `|p-q|` 很小），可以使用 Fermat 方法：

`n = p×q = ((p+q)/2)² - ((p-q)/2)² = a² - b²`

从 `a = ⌈√n⌉` 开始递增，检查 `a² - n` 是否为完全平方数。

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

#### 3.2.3 Pollard's p-1 算法

若 `p-1` 只有小素因子（即 `p-1` 是 `B-smooth`），则可以通过计算 `a^(B!) mod n` 并利用 GCD 找到因子。

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

#### 3.2.4 Pollard's Rho 算法

使用 Floyd 判圈算法，通过伪随机序列在模 `n` 下寻找碰撞，期望时间复杂度 `O(n^(1/4))`。

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

#### 3.2.5 ECM（椭圆曲线方法）

对于中等大小的因子（20-50位十进制数），ECM 是最有效的方法之一。利用椭圆曲线群上的运算来寻找因子。

#### 3.2.6 二次筛法（Quadratic Sieve, QS）

适用于100位以下的整数分解。通过寻找满足 `x² ≡ y² mod n` 的数对来分解 `n`。

#### 3.2.7 一般数域筛法（General Number Field Sieve, GNFS）

目前已知最快的经典整数分解算法，适用于100位以上的大整数。时间复杂度为 `L_n[1/3, c]`。

### 3.3 小公钥指数攻击

#### 3.3.1 小 e 攻击（e=3）

当 `e=3` 且 `M³ < n` 时，可以直接对密文开立方根得到明文：`M = ⌊C^(1/3)⌋`。

#### 3.3.2 广播攻击（Håstad's Attack）

若同一明文 `M` 使用相同的 `e` 和不同的 `n₁, n₂, ..., nₑ` 加密，且 `Mᵉ < n₁×n₂×...×nₑ`，则可以使用中国剩余定理（CRT）恢复 `Mᵉ`，再开 `e` 次方根。

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
M = gmpy2.iroot(M_e, 3)[0]  # 开立方根
```

#### 3.3.3 Franklin-Reiter 相关消息攻击

若两个明文 `M₁` 和 `M₂` 满足线性关系 `M₂ = f(M₁)`（如 `M₂ = a·M₁ + b`），且使用相同的 `(n, e)` 加密，则当 `e=3` 时可以直接恢复明文。

#### 3.3.4 Coppersmith 攻击

Coppersmith 方法可以在多项式时间内找到模 `n` 下的小根。

> 💡 **应用场景：**
> - **部分消息泄露：** 若已知明文的最高位或最低位，可以恢复剩余部分。
> - **stereotyped messages：** 若明文格式为 `M = pad || m`，且 `m` 较小，可以恢复 `m`。
> - **低私钥指数：** 当 `d < n^0.292` 时，Boneh-Durfee 扩展可以恢复 `d`。

```python
# 使用 SageMath 的 Coppersmith
# 假设已知 M = known_prefix * 2^k + x，求小根 x
PR.<x> = PolynomialRing(Zmod(n))
f = (known_prefix * 2^k + x)^e - c
roots = f.small_roots(X=2^k, beta=1)
```

### 3.4 私钥恢复攻击

#### 3.4.1 Wiener 攻击

当私钥 `d < n^0.25 / 3` 时，可以通过连分数展开 `e/n` 来恢复 `d`。

> 💡 **原理：** `e/n ≈ e/φ(n) = k/d`（对于某个小整数 `k`）。因此 `k/d` 是 `e/n` 的一个收敛子，可以通过连分数算法找到。

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

#### 3.4.2 Boneh-Durfee 攻击

Wiener 攻击的扩展，当 `d < n^0.292` 时有效。使用格基约减（LLL）算法在二维格中寻找短向量。

### 3.5 共模与共因子攻击

#### 3.5.1 共模攻击（Common Modulus Attack）

若同一明文 `M` 使用相同的 `n` 和互质的 `e₁, e₂` 加密得到 `C₁, C₂`，则可以通过扩展欧几里得算法找到 `a, b` 使得 `a·e₁ + b·e₂ = 1`，然后计算 `M = C₁ᵃ × C₂ᵇ mod n`。

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

#### 3.5.2 共因子攻击（GCD Attack / Common Factor Attack）

若多个 RSA 模数共享一个素因子（如 `n₁ = p×q₁`, `n₂ = p×q₂`），则计算 `gcd(n₁, n₂) = p` 即可分解。

```python
# 批量 GCD 攻击（针对大量模数）
def batch_gcd_attack(moduli):
    from math import gcd
    for i in range(len(moduli)):
        for j in range(i+1, len(moduli)):
            g = gcd(moduli[i], moduli[j])
            if g > 1:
                return i, j, g
    return None
```

### 3.6 选择密文攻击

#### 3.6.1 Bleichenbacher 攻击（PKCS#1 v1.5 Padding Oracle）

针对 RSA 加密使用 PKCS#1 v1.5 填充的情况。若服务器在解密后检查填充格式，并在格式错误时返回不同的错误信息，则攻击者可以：
1. 选择倍数 `s`，构造 `C' = C × sᵉ mod n`。
2. 发送 `C'` 给服务器，观察是否通过填充检查。
3. 通过二分搜索逐步缩小明文所在的区间，最终完全恢复明文。

#### 3.6.2 ROBOT 攻击

Bleichenbacher 攻击的现代变体，针对 TLS 中使用 RSA 密钥交换的实现。2017年发现，影响了多个主流TLS库。

### 3.7 侧信道与实现攻击

#### 3.7.1 时序攻击

模幂运算中的条件分支（如 Montgomery 约减）会导致执行时间依赖于密钥比特。通过精确测量解密时间，可以逐位恢复私钥 `d`。

#### 3.7.2 故障注入攻击（Fault Injection）

通过电压/时钟/激光故障注入，在模幂运算中引入计算错误。例如，若 `Cᵈ mod n` 中某一步出错得到 `M'`，则 `gcd(M - M', n)` 可能泄露因子信息。

#### 3.7.3 ROCA 攻击（Return of Coppersmith's Attack）

2017年发现，某些硬件安全密钥（如 YubiKey）使用弱随机数生成器生成 RSA 素数，导致素数具有特定结构。利用 Coppersmith 方法可以高效分解这些弱密钥。

### 3.8 特殊场景攻击

#### 3.8.1 低解密指数与 CRT

若使用中国剩余定理（CRT）加速解密，且其中一个素数参数计算错误，则可以通过单条错误结果恢复 `p` 和 `q`。

#### 3.8.2 部分密钥泄露攻击

若已知私钥 `d` 的部分比特（如最高位的一半），可以使用格方法恢复完整私钥。

#### 3.8.3 RSA 盲签名攻击

若服务器对任意消息进行 RSA 盲签名（先对消息哈希再签名），攻击者可以构造特殊消息绕过哈希检查，获得对恶意消息的合法签名。

## 第四章：椭圆曲线密码攻击

### 4.1 ECC 基础

椭圆曲线密码学（ECC）基于椭圆曲线离散对数问题（ECDLP）的困难性。给定椭圆曲线 `E` 上的点 `P` 和 `Q = d·P`，求整数 `d` 是困难的。

### 4.2 离散对数攻击

#### 4.2.1 大步小步法（Baby-Step Giant-Step, BSGS）

时间复杂度和空间复杂度均为 `O(√n)`。适用于阶数不太大的群。

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

使用随机游走在椭圆曲线上寻找碰撞，期望时间复杂度 `O(√n)`，但空间复杂度仅为 `O(1)`。

#### 4.2.3 Pohlig-Hellman 算法

若群的阶 `n` 可以分解为小素数的乘积 `n = p₁^e₁ × p₂^e₂ × ...`，则可以在每个子群上分别求解离散对数，再用中国剩余定理组合结果。

> ⚠️ **CTF 关键点：** 若椭圆曲线的阶是光滑数（smooth number），即所有素因子都很小，则 Pohlig-Hellman 可以在多项式时间内破解 ECDLP！

### 4.3 弱曲线攻击

#### 4.3.1 异常曲线攻击（Anomalous Curve Attack）

若椭圆曲线的阶 `#E(F_p) = p`（即曲线是 anomalous 的），则 ECDLP 可以在多项式时间内求解。Semaev、Satoh-Araki、Smart 分别独立发现了此攻击。

#### 4.3.2 MOV 攻击（Menezes-Okamoto-Vanstone）

利用 Weil 配对或 Tate 配对，将椭圆曲线上的离散对数问题映射到有限域的乘法群上。若嵌入度（embedding degree）`k` 很小（如 `k ≤ 6`），则可以使用指数积分法（Index Calculus）在有限域上求解，比直接攻击 ECDLP 容易得多。

> ⚠️ **防御：** 实际应用中应选择嵌入度大的曲线（如标准曲线 secp256k1 的嵌入度约为 `10⁷⁵`）。

#### 4.3.3 奇异曲线攻击

若判别式 `Δ = 0`，曲线是奇异的，可以映射到加法群或乘法群上，使 ECDLP 变得容易。

### 4.4 ECDSA 签名攻击

#### 4.4.1 Nonce 重用攻击

ECDSA 签名中，每次签名必须使用不同的随机数 `k`。若两次签名使用了相同的 `k`：

```
s₁ = k⁻¹(H(m₁) + r·d)
s₂ = k⁻¹(H(m₂) + r·d)
```

两式相减可消去 `d`，直接解出 `k`，进而解出私钥 `d`。

```python
def ecdsa_nonce_reuse(r, s1, s2, h1, h2, n):
    k = ((h1 - h2) * pow(s1 - s2, -1, n)) % n
    d = ((s1 * k - h1) * pow(r, -1, n)) % n
    return k, d
```

#### 4.4.2 Nonce 偏置攻击（Nonce Bias / Lattice Attack）

若 `k` 的某些比特已知或存在偏置（如由有偏随机数生成器产生），可以使用格方法（LLL）恢复私钥。例如，若 `k` 的最高位已知，或 `k` 小于某个阈值，可以构造格并应用 LLL 算法。

#### 4.4.3 签名延展性（Signature Malleability）

若 `(r, s)` 是有效签名，则 `(r, -s mod n)` 也是有效签名。在某些实现中可能导致重放攻击。

### 4.5 ECC 实现攻击

#### 4.5.1 点验证缺失攻击

若实现不验证输入点是否在曲线上，攻击者可以发送不在曲线上的点，利用错误的点运算泄露私钥信息（如 Invalid Curve Attack）。

#### 4.5.2 Small Subgroup 攻击

发送低阶点给服务器，使得共享密钥被限制在很小的子群中，可以通过穷举恢复。

## 第五章：哈希函数与 MAC 攻击

### 5.1 哈希函数攻击

#### 5.1.1 碰撞攻击（Collision Attack）

找到两个不同的消息 `M₁ ≠ M₂` 使得 `H(M₁) = H(M₂)`。对于 `n` 位哈希，生日攻击的复杂度约为 `2^(n/2)`。

> ⚠️ **MD5 碰撞：** MD5 是128位哈希，理论安全强度应为64位。但 Wang Xiaoyun 在2004年发现了实用的 MD5 碰撞方法，现在可以在秒级生成碰撞。

#### 5.1.2 长度扩展攻击（Length Extension Attack）

针对 Merkle-Damgård 结构的哈希（如 MD5、SHA-1、SHA-256）。若知道 `H(secret || message)` 和 `message` 的长度，可以计算 `H(secret || message || padding || append)` 而不知道 `secret`。

> 💡 **受影响：** MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512
> **不受影响：** SHA-3 (Keccak), BLAKE2, HMAC

```python
# 使用 hashpumpy 进行长度扩展攻击
import hashpumpy
new_hash, new_data = hashpumpy.hashpump(
    original_hash, original_data, 
    data_to_append, key_length
)
```

#### 5.1.3 哈希长度扩展的 CTF 利用

常见于自定义的 MAC 构造：`MAC = H(secret || message)`。攻击者可以：
1. 截获合法请求 `(message, MAC)`。
2. 构造新消息 `message' = message || padding || evil_command`。
3. 计算新的 `MAC'` 而无需知道 `secret`。
4. 服务器验证 `MAC'` 通过，执行 `evil_command`。

#### 5.1.4 前缀碰撞攻击

构造两个消息 `M₁` 和 `M₂`，使得对于任意前缀 `P`，`H(P || M₁) = H(P || M₂)`。针对 MD5 有实用的前缀碰撞工具（如 HashClash）。

### 5.2 MAC 攻击

#### 5.2.1 HMAC 安全性

HMAC 是安全的 MAC 构造：`HMAC(K, M) = H((K' ⊕ opad) || H((K' ⊕ ipad) || M))`。不受长度扩展攻击影响。

#### 5.2.2 时序攻击（Timing Attack on MAC Comparison）

若服务器使用 `==` 逐字节比较 MAC，且提前返回失败，则比较时间泄露了第一个不匹配字节的位置。攻击者可以逐字节猜测正确的 MAC。

> ✅ **防御：** 使用恒定时间比较函数（如 `hmac.compare_digest` 或 `crypto.timing_safe_equal`）。

#### 5.2.3 CBC-MAC 攻击

简单的 CBC-MAC（对消息进行 CBC 加密并取最后一个块）存在多种攻击：
- **消息延展：** 若 `M` 的 MAC 是 `T`，则 `M || (T ⊕ M_next)` 的 MAC 可以预测。
- **重排攻击：** 若使用相同的密钥进行 CBC 加密和 CBC-MAC，存在严重安全问题。

> ✅ **安全变体：** CMAC、OMAC、PMAC 等。

### 5.3 密码哈希攻击

#### 5.3.1 彩虹表攻击

针对未加盐的密码哈希。通过预计算大量哈希链，以时间换空间，可以在短时间内反转哈希值。

> ✅ **防御：** 使用随机盐（salt）和慢哈希函数（如 bcrypt、scrypt、Argon2）。

#### 5.3.2 密码哈希比较时序攻击

与 MAC 时序攻击类似，若密码哈希比较不是恒定时间的，可能泄露信息。

## 第六章：密码协议攻击

### 6.1 Diffie-Hellman 密钥交换攻击

#### 6.1.1 小群攻击（Small Subgroup Attack）

攻击者发送低阶元素给一方，使得共享密钥被限制在小子群中。若实现不验证接收到的元素阶数，则共享密钥可以被穷举。

#### 6.1.2 Logjam 攻击

2015年发现的攻击，针对使用512位或更弱DH参数的TLS连接。通过预计算512位素域的离散对数，可以实时降级连接并恢复会话密钥。

#### 6.1.3 恶意参数攻击

若攻击者可以控制DH参数，可以选择特殊构造的 `p` 使得离散对数容易计算（如 `p-1` 只有小素因子）。

### 6.2 TLS/SSL 攻击

#### 6.2.1 BEAST 攻击

针对 TLS 1.0 的 CBC 模式。利用 IV 可预测性（IV=前一个密文块），通过选择明文攻击逐字节恢复 Cookie。

#### 6.2.2 CRIME 攻击

利用 TLS 压缩（DEFLATE）的副作用。攻击者控制部分明文，通过观察压缩后密文长度变化，逐字节恢复敏感信息（如 Cookie）。

#### 6.2.3 BREACH 攻击

CRIME 的 HTTP 层变体，针对 HTTP 响应压缩。即使 TLS 压缩已关闭，HTTP 压缩仍可被利用。

#### 6.2.4 POODLE 攻击

针对 SSL 3.0 的填充 Oracle。利用 SSL 3.0 填充不验证的弱点，结合 JavaScript 逐字节解密 HTTPS 请求中的敏感数据。

#### 6.2.5 Heartbleed

虽然主要是实现漏洞，但属于密码协议实现中的严重问题。OpenSSL 的心跳扩展未做边界检查，导致可以读取服务器内存中的私钥、密码等敏感信息。

### 6.3 重放攻击与中间人攻击

#### 6.3.1 重放攻击（Replay Attack）

截获合法的消息并重新发送。防御方法包括：时间戳、随机数（nonce）、序列号、一次性令牌。

#### 6.3.2 中间人攻击（Man-in-the-Middle）

攻击者在通信双方之间拦截并可能修改消息。若不进行身份验证（如仅使用 DH 而不验证公钥），则容易受到 MITM 攻击。

### 6.4 零知识证明攻击

#### 6.4.1 Fiat-Shamir 启发式的不当使用

若将交互式零知识证明转换为非交互式时，挑战值不是通过哈希计算而是固定或可预测的，则攻击者可以伪造证明。

## 第七章：编码、隐写与杂项

### 7.1 编码家族

#### 7.1.1 Base 系列

| 编码 | 特征 | 识别方法 |
|------|------|---------|
| Base64 | A-Z, a-z, 0-9, +/, = 填充 | 常见，= 结尾 |
| Base32 | A-Z, 2-7, = 填充 | 全大写或数字 |
| Base16 (Hex) | 0-9, A-F | 纯十六进制 |
| Base58 | 比特币地址，无 0/O/I/l | 无相似字符 |
| Base85 (Ascii85) | !, -, ~ 等字符 | 以 <~ ~> 包裹 |
| Base91 | 扩展ASCII字符集 | 更紧凑 |
| Base100 | Emoji 表情 | 全是 emoji |

#### 7.1.2 URL 编码 / HTML 实体编码

URL 编码使用 `%XX` 格式，HTML 实体使用 `&#DD;` 或 `&name;`。

#### 7.1.3 Unicode 隐写

- **零宽字符：** 零宽空格（U+200B）、零宽非连接符（U+200C）、零宽连接符（U+200D）可用于隐藏信息。
- **同形异义字：** 使用不同 Unicode 字符表示相似字形（如 Cyrillic а vs Latin a）。
- **不可见字符：** 从右至左标记（U+202E）等控制字符。

### 7.2 隐写术（Steganography）

#### 7.2.1 LSB 隐写（Least Significant Bit）

将信息隐藏在图像像素值的最低有效位中。对于24位BMP图像，每个像素可以隐藏3比特信息。

> 💡 **检测：** Chi-Square 测试、RS 分析、视觉攻击（查看 LSB 平面）。

#### 7.2.2 音频隐写

- **LSB 音频：** 类似图像 LSB，修改采样值的最低位。
- **频谱隐写：** 将信息嵌入频域，使用 FFT/DFT 转换后修改系数。
- **回声隐写：** 通过引入回声编码信息。

#### 7.2.3 文件格式隐写

- **追加数据：** 将数据附加在文件末尾（如图片后附加zip）。
- **文件拼接：** 利用文件格式的容错性，构造多格式文件。
- **EXIF 数据：** 在图片的元数据中隐藏信息。

### 7.3 常见 CTF 编码谜题

#### 7.3.1 曼彻斯特编码 / 差分曼彻斯特

数字通信中的线路编码，CTF 中可能以波形或二进制序列形式出现。

#### 7.3.2 线路编码识别

| 编码 | 特征 |
|------|------|
| NRZ | 高=1, 低=0 |
| NRZI | 电平翻转=1, 不变=0 |
| Manchester | 上升沿=0, 下降沿=1 (或相反) |
| Differential Manchester | 位开始处翻转=0, 不翻转=1 |

#### 7.3.3 进制转换与自定义编码

CTF 中常出现自定义进制或混合编码，如：
- 将字符串转为二进制后重新分组解释。
- 使用非标准字符集进行替换。
- 多层嵌套编码（如 Base64 → Hex → Base32 → ...）。

## 第八章：侧信道与实现攻击

### 8.1 时序攻击（Timing Attack）

通过精确测量操作执行时间来推断密钥信息。最早由 Kocher 在1996年提出。

#### 8.1.1 平方-乘模幂时序攻击

模幂运算的平方-乘算法中，当密钥比特为1时执行乘法，为0时不执行。通过测量时间差异可以逐位恢复密钥。

> ✅ **防御：** 恒定时间算法（always square-and-multiply）、 Montgomery ladder、盲化技术。

### 8.2 缓存攻击（Cache Attack）

#### 8.2.1 Flush+Reload

利用 CPU 缓存的共享特性。攻击者：
1. 将目标内存行 flush 出缓存。
2. 等待目标进程执行。
3. reload 并测量访问时间。若时间短，说明目标进程访问了该内存行。

#### 8.2.2 Prime+Probe

攻击者用自己的数据填充缓存集（prime），等待目标执行后，测量重新访问自己数据的时间（probe）。时间变长说明目标访问了该缓存集。

### 8.3 功耗分析（Power Analysis）

#### 8.3.1 简单功耗分析（SPA）

直接观察功耗轨迹，识别不同的操作（如乘法 vs 加法）。RSA 的平方-乘算法在 SPA 下密钥比特清晰可见。

#### 8.3.2 差分功耗分析（DPA）

收集大量功耗轨迹，使用统计方法（如差分）提取与密钥相关的信息。即使噪声很大也能有效工作。

### 8.4 故障注入（Fault Injection）

#### 8.4.1 电压/时钟毛刺

通过瞬时改变供电电压或时钟频率，导致处理器跳过指令或产生错误结果。

#### 8.4.2 RSA 故障攻击

若在 CRT-RSA 解密过程中，一个素数模下的计算出错（如 `m_p` 正确但 `m_q` 错误），则错误结果 `m'` 满足 `m' ≡ m mod p` 但 `m' ≢ m mod q`，因此 `gcd(m'ᵉ - c, n)` 可泄露因子信息。

#### 8.4.3 AES 故障攻击

在 AES 最后一轮注入故障，可以恢复最后一轮的子密钥。通过在特定轮次注入故障，可以逐轮恢复所有轮密钥。

## 第九章：后量子密码与前沿攻击

### 9.1 量子计算对密码学的威胁

#### 9.1.1 Shor 算法

量子算法，可以在多项式时间内解决整数分解和离散对数问题。对于 `n` 位整数，Shor 算法需要约 `O(n³)` 量子门操作和 `O(n)` 量子比特。

> ⚠️ **影响：** RSA、DSA、ECDSA、ECDH、DH 等所有基于整数分解或离散对数的密码系统。

#### 9.1.2 Grover 算法

量子搜索算法，可以将穷举搜索的复杂度从 `O(N)` 降低到 `O(√N)`。对于对称密码，意味着有效密钥长度减半（如 AES-256 降为 AES-128 级别）。

### 9.2 后量子密码学（PQC）

#### 9.2.1 格密码学（Lattice-Based）

基于格上困难问题：最短向量问题（SVP）和最近向量问题（CVP）。代表算法：NTRU、Kyber、Dilithium。

> 💡 **格攻击：** LLL 算法、BKZ 算法用于格基约减。在 CTF 中可能遇到低维格上的隐藏数问题（HNP）或近似CVP问题。

#### 9.2.2 编码密码学（Code-Based）

基于纠错码的困难问题。代表算法：McEliece、Classic McEliece。

#### 9.2.3 多变量密码学（Multivariate）

基于有限域上多元二次方程组的求解困难性。代表算法：Rainbow、UOV。

#### 9.2.4 哈希签名（Hash-Based）

基于哈希函数的安全性。代表算法：Lamport、Winternitz、SPHINCS+。

### 9.3 格密码 CTF 攻击

#### 9.3.1 隐藏数问题（Hidden Number Problem, HNP）

给定 `tᵢ` 和 `MSB_k(tᵢ·x mod p)`，恢复 `x`。可以转化为格上的 CVP 问题。

#### 9.3.2 ECDSA 的格攻击

若 ECDSA 签名中的 nonce `k` 有偏置（如最高位已知），可以构造格并使用 LLL 恢复私钥。

```python
# SageMath: ECDSA nonce bias lattice attack
# 假设已知多个签名的 (h, r, s) 且 k 的某些比特已知
M = Matrix(ZZ, [...])  # 构造格
L = M.LLL()
# 短向量中包含私钥信息
```

### 9.4 同态加密攻击

#### 9.4.1 噪声管理攻击

部分同态加密（如 Paillier）和全同态加密（FHE）依赖噪声管理。若噪声增长超过阈值，解密结果将出错。

#### 9.4.2 密钥恢复攻击

某些同态加密方案在特定参数选择下可能存在密钥恢复漏洞。

## 第十章：CTF 实战工具链与速查表

### 10.1 必备工具

| 工具 | 用途 | 链接/命令 |
|------|------|----------|
| SageMath | 数学计算、格基约减、数论 | sage |
| Python + gmpy2 | 大整数运算、模运算 | pip install gmpy2 |
| PyCryptodome | 密码学库 | pip install pycryptodome |
| openssl | 证书、加解密 | openssl |
| hashcat | 密码哈希破解 | hashcat |
| John the Ripper | 密码破解 | john |
| zsteg | PNG/BMP LSB 隐写 | gem install zsteg |
| steghide | 音频/图像隐写 | steghide |
| binwalk | 文件提取、分析 | binwalk -e file |
| foremost | 文件恢复 | foremost -i file |
| RsaCtfTool | RSA 攻击自动化 | github.com/Ganapati/RsaCtfTool |
| factordb | 在线因子数据库 | factordb.com |
| Alpertron ECM | 在线整数分解 | alpertron.com.ar/ECM.HTM |
| CyberChef | 编码转换万能工具 | gchq.github.io/CyberChef |
| hashpumpy | 哈希长度扩展攻击 | pip install hashpumpy |
| pwntools | CTF 交互与漏洞利用 | pip install pwntools |

### 10.2 RSA 攻击决策树

```
给定 n, e, c:
│
├─ n 可以分解？
│  ├─ 是 → 直接计算 φ(n)，求 d，解密
│  └─ 否 → 继续
│
├─ e 很小？（如 e=3）
│  ├─ 是 → 尝试直接开方、广播攻击、Franklin-Reiter
│  └─ 否 → 继续
│
├─ 有多个 (n,e) 对且 n 有公因子？
│  ├─ 是 → GCD 攻击分解 n
│  └─ 否 → 继续
│
├─ e/n 的连分数收敛子中是否有 k/d？
│  ├─ 是 → Wiener 攻击
│  └─ 否 → 继续
│
├─ 已知部分明文？
│  ├─ 是 → Coppersmith 方法
│  └─ 否 → 继续
│
├─ 有 Padding Oracle？
│  ├─ 是 → Bleichenbacher 攻击
│  └─ 否 → 可能需要更高级的格方法
```

### 10.3 常见 CTF Crypto 题型速查

| 题型特征 | 攻击思路 | 工具/脚本 |
|---------|---------|----------|
| 给了一段密文，提示古典密码 | 频率分析、Kasiski、IoC | Python 脚本 |
| 给了 n, e, c，e 很小 | 小e攻击、广播攻击 | gmpy2.iroot, crt |
| 给了多个 n | GCD攻击、共模攻击 | math.gcd |
| 给了 e, n，e 很大 | Wiener攻击、Boneh-Durfee | SageMath + LLL |
| 给了加密 Oracle | Padding Oracle、选择明文 | pwntools |
| 给了哈希值和长度扩展提示 | 长度扩展攻击 | hashpumpy |
| 给了图片/音频文件 | LSB、频谱、EXIF、追加数据 | zsteg, binwalk, steghide |
| 给了 ECC 参数和点 | BSGS、Pohlig-Hellman、MOV | SageMath |
| 给了 ECDSA 签名对 | Nonce重用、格攻击 | SageMath |
| 多层编码 | 逐层解码 | CyberChef |

### 10.4 Python 速查代码片段

#### 10.4.1 扩展欧几里得算法

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

#### 10.4.2 中国剩余定理

```python
def crt(a, m):
    # a: 余数列表, m: 模数列表
    from functools import reduce
    M = reduce(lambda x, y: x*y, m)
    result = 0
    for ai, mi in zip(a, m):
        Mi = M // mi
        result += ai * Mi * pow(Mi, -1, mi)
    return result % M
```

#### 10.4.3 快速因数分解尝试

```python
from sympy import factorint, isprime
from gmpy2 import isqrt, gcd

def factor_small(n):
    # 试除小因子
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

#### 10.4.4 椭圆曲线基础运算（SageMath）

```python
# 定义曲线
p = ...  # 素域
a, b = ..., ...  # 曲线参数
E = EllipticCurve(GF(p), [a, b])

# 定义点
P = E(x, y)
n = P.order()  # 点的阶

# BSGS
Q = d*P  # 已知
k = discrete_log(Q, P, operation='+')
```

## 结语

> 🎯 密码学攻击是一个不断演进的领域。从古典密码的频率分析，到现代 RSA 的格基攻击，再到量子计算带来的范式转变，每一种攻击手段都揭示了密码实现中的潜在弱点。在 CTF 竞赛中，掌握这些攻击技术不仅能帮助你快速解题，更能深入理解密码学的设计原理与安全边界。
>
> **记住：** 最好的防御是理解攻击。只有深入掌握攻击手段，才能设计出真正安全的密码系统。
>
> *— 祝你在 CTF 赛场上旗开得胜！🏁*
