import { of } from "rxjs";
import { ZXCVBNResult, ZXCVBNSequence } from "zxcvbn";

import { MasterPasswordPolicyOptions } from "@bitwarden/common/admin-console/models/domain/master-password-policy-options";
import { AccountInfo } from "@bitwarden/common/auth/abstractions/account.service";
import { UserId } from "@bitwarden/common/types/guid";

export const mockActiveAccount$ = of({
  id: "5555-5555-5555",
  email: "jdoe@example.com",
  emailVerified: true,
  name: "John Doe",
} as { id: UserId } & AccountInfo);

export const mockMasterPasswordPolicyOptions$ = of({
  minComplexity: 3,
  minLength: 10,
  requireUpper: true,
  requireLower: true,
  requireNumbers: true,
  requireSpecial: true,
} as MasterPasswordPolicyOptions);

export const mockZXCVBNResult = {
  password: "abcdef123456!@#",
  guesses: 115000000,
  guesses_log10: 8.06069784035361,
  sequence: [
    {
      pattern: "sequence",
      i: 0,
      j: 5,
      token: "abcdef",
      sequence_name: "lower",
      sequence_space: 26,
      ascending: true,
      guesses: 50,
      guesses_log10: 1.6989700043360185,
    } as ZXCVBNSequence,
    {
      pattern: "dictionary",
      i: 6,
      j: 11,
      token: "123456",
      matched_word: "123456",
      rank: 1,
      dictionary_name: "passwords",
      reversed: false,
      l33t: false,
      base_guesses: 1,
      uppercase_variations: 1,
      l33t_variations: 1,
      guesses: 50,
      guesses_log10: 1.6989700043360185,
    } as ZXCVBNSequence,
    {
      pattern: "bruteforce",
      token: "!@#",
      i: 12,
      j: 14,
      guesses: 1000,
      guesses_log10: 2.9999999999999996,
    } as ZXCVBNSequence,
  ],
  calc_time: 2,
  crack_times_seconds: {
    online_throttling_100_per_hour: 4140000000,
    online_no_throttling_10_per_second: 11500000,
    offline_slow_hashing_1e4_per_second: 11500,
    offline_fast_hashing_1e10_per_second: 0.0115,
  },
  crack_times_display: {
    online_throttling_100_per_hour: "centuries",
    online_no_throttling_10_per_second: "4 months",
    offline_slow_hashing_1e4_per_second: "3 hours",
    offline_fast_hashing_1e10_per_second: "less than a second",
  },
  score: 3,
  feedback: {
    warning: "",
    suggestions: [],
  },
} as ZXCVBNResult;
