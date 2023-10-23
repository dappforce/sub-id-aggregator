import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  BigInt: { input: any; output: any };
  DateTime: { input: any; output: any };
};

export type Account = {
  __typename?: 'Account';
  id: Scalars['String']['output'];
  identity?: Maybe<Identity>;
  publicKey: Scalars['String']['output'];
  rewards: Array<StakingReward>;
  sub?: Maybe<IdentitySub>;
  transfers: Array<Transfer>;
};

export type AccountRewardsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<StakingRewardOrderByInput>>;
  where?: InputMaybe<StakingRewardWhereInput>;
};

export type AccountTransfersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TransferOrderByInput>>;
  where?: InputMaybe<TransferWhereInput>;
};

export type AccountEdge = {
  __typename?: 'AccountEdge';
  cursor: Scalars['String']['output'];
  node: Account;
};

export enum AccountOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IdentityDisplayAsc = 'identity_display_ASC',
  IdentityDisplayDesc = 'identity_display_DESC',
  IdentityEmailAsc = 'identity_email_ASC',
  IdentityEmailDesc = 'identity_email_DESC',
  IdentityIdAsc = 'identity_id_ASC',
  IdentityIdDesc = 'identity_id_DESC',
  IdentityImageAsc = 'identity_image_ASC',
  IdentityImageDesc = 'identity_image_DESC',
  IdentityIsKilledAsc = 'identity_isKilled_ASC',
  IdentityIsKilledDesc = 'identity_isKilled_DESC',
  IdentityJudgementAsc = 'identity_judgement_ASC',
  IdentityJudgementDesc = 'identity_judgement_DESC',
  IdentityLegalAsc = 'identity_legal_ASC',
  IdentityLegalDesc = 'identity_legal_DESC',
  IdentityPgpFingerprintAsc = 'identity_pgpFingerprint_ASC',
  IdentityPgpFingerprintDesc = 'identity_pgpFingerprint_DESC',
  IdentityRiotAsc = 'identity_riot_ASC',
  IdentityRiotDesc = 'identity_riot_DESC',
  IdentityTwitterAsc = 'identity_twitter_ASC',
  IdentityTwitterDesc = 'identity_twitter_DESC',
  IdentityWebAsc = 'identity_web_ASC',
  IdentityWebDesc = 'identity_web_DESC',
  PublicKeyAsc = 'publicKey_ASC',
  PublicKeyDesc = 'publicKey_DESC',
  SubIdAsc = 'sub_id_ASC',
  SubIdDesc = 'sub_id_DESC',
  SubNameAsc = 'sub_name_ASC',
  SubNameDesc = 'sub_name_DESC',
}

export type AccountWhereInput = {
  AND?: InputMaybe<Array<AccountWhereInput>>;
  OR?: InputMaybe<Array<AccountWhereInput>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  identity?: InputMaybe<IdentityWhereInput>;
  identity_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  publicKey_contains?: InputMaybe<Scalars['String']['input']>;
  publicKey_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  publicKey_endsWith?: InputMaybe<Scalars['String']['input']>;
  publicKey_eq?: InputMaybe<Scalars['String']['input']>;
  publicKey_gt?: InputMaybe<Scalars['String']['input']>;
  publicKey_gte?: InputMaybe<Scalars['String']['input']>;
  publicKey_in?: InputMaybe<Array<Scalars['String']['input']>>;
  publicKey_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  publicKey_lt?: InputMaybe<Scalars['String']['input']>;
  publicKey_lte?: InputMaybe<Scalars['String']['input']>;
  publicKey_not_contains?: InputMaybe<Scalars['String']['input']>;
  publicKey_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  publicKey_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  publicKey_not_eq?: InputMaybe<Scalars['String']['input']>;
  publicKey_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  publicKey_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  publicKey_startsWith?: InputMaybe<Scalars['String']['input']>;
  rewards_every?: InputMaybe<StakingRewardWhereInput>;
  rewards_none?: InputMaybe<StakingRewardWhereInput>;
  rewards_some?: InputMaybe<StakingRewardWhereInput>;
  sub?: InputMaybe<IdentitySubWhereInput>;
  sub_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  transfers_every?: InputMaybe<TransferWhereInput>;
  transfers_none?: InputMaybe<TransferWhereInput>;
  transfers_some?: InputMaybe<TransferWhereInput>;
};

export type AccountsConnection = {
  __typename?: 'AccountsConnection';
  edges: Array<AccountEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type IdentitiesConnection = {
  __typename?: 'IdentitiesConnection';
  edges: Array<IdentityEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Identity = {
  __typename?: 'Identity';
  account: Account;
  additional?: Maybe<Array<IdentityAdditionalField>>;
  display?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isKilled: Scalars['Boolean']['output'];
  judgement: Judgement;
  legal?: Maybe<Scalars['String']['output']>;
  pgpFingerprint?: Maybe<Scalars['String']['output']>;
  riot?: Maybe<Scalars['String']['output']>;
  subs: Array<IdentitySub>;
  twitter?: Maybe<Scalars['String']['output']>;
  web?: Maybe<Scalars['String']['output']>;
};

export type IdentitySubsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<IdentitySubOrderByInput>>;
  where?: InputMaybe<IdentitySubWhereInput>;
};

export type IdentityAdditionalField = {
  __typename?: 'IdentityAdditionalField';
  name?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type IdentityEdge = {
  __typename?: 'IdentityEdge';
  cursor: Scalars['String']['output'];
  node: Identity;
};

export enum IdentityOrderByInput {
  AccountIdAsc = 'account_id_ASC',
  AccountIdDesc = 'account_id_DESC',
  AccountPublicKeyAsc = 'account_publicKey_ASC',
  AccountPublicKeyDesc = 'account_publicKey_DESC',
  DisplayAsc = 'display_ASC',
  DisplayDesc = 'display_DESC',
  EmailAsc = 'email_ASC',
  EmailDesc = 'email_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ImageAsc = 'image_ASC',
  ImageDesc = 'image_DESC',
  IsKilledAsc = 'isKilled_ASC',
  IsKilledDesc = 'isKilled_DESC',
  JudgementAsc = 'judgement_ASC',
  JudgementDesc = 'judgement_DESC',
  LegalAsc = 'legal_ASC',
  LegalDesc = 'legal_DESC',
  PgpFingerprintAsc = 'pgpFingerprint_ASC',
  PgpFingerprintDesc = 'pgpFingerprint_DESC',
  RiotAsc = 'riot_ASC',
  RiotDesc = 'riot_DESC',
  TwitterAsc = 'twitter_ASC',
  TwitterDesc = 'twitter_DESC',
  WebAsc = 'web_ASC',
  WebDesc = 'web_DESC',
}

export type IdentitySub = {
  __typename?: 'IdentitySub';
  account: Account;
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  super?: Maybe<Identity>;
};

export type IdentitySubEdge = {
  __typename?: 'IdentitySubEdge';
  cursor: Scalars['String']['output'];
  node: IdentitySub;
};

export enum IdentitySubOrderByInput {
  AccountIdAsc = 'account_id_ASC',
  AccountIdDesc = 'account_id_DESC',
  AccountPublicKeyAsc = 'account_publicKey_ASC',
  AccountPublicKeyDesc = 'account_publicKey_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  SuperDisplayAsc = 'super_display_ASC',
  SuperDisplayDesc = 'super_display_DESC',
  SuperEmailAsc = 'super_email_ASC',
  SuperEmailDesc = 'super_email_DESC',
  SuperIdAsc = 'super_id_ASC',
  SuperIdDesc = 'super_id_DESC',
  SuperImageAsc = 'super_image_ASC',
  SuperImageDesc = 'super_image_DESC',
  SuperIsKilledAsc = 'super_isKilled_ASC',
  SuperIsKilledDesc = 'super_isKilled_DESC',
  SuperJudgementAsc = 'super_judgement_ASC',
  SuperJudgementDesc = 'super_judgement_DESC',
  SuperLegalAsc = 'super_legal_ASC',
  SuperLegalDesc = 'super_legal_DESC',
  SuperPgpFingerprintAsc = 'super_pgpFingerprint_ASC',
  SuperPgpFingerprintDesc = 'super_pgpFingerprint_DESC',
  SuperRiotAsc = 'super_riot_ASC',
  SuperRiotDesc = 'super_riot_DESC',
  SuperTwitterAsc = 'super_twitter_ASC',
  SuperTwitterDesc = 'super_twitter_DESC',
  SuperWebAsc = 'super_web_ASC',
  SuperWebDesc = 'super_web_DESC',
}

export type IdentitySubWhereInput = {
  AND?: InputMaybe<Array<IdentitySubWhereInput>>;
  OR?: InputMaybe<Array<IdentitySubWhereInput>>;
  account?: InputMaybe<AccountWhereInput>;
  account_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_eq?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_not_eq?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_startsWith?: InputMaybe<Scalars['String']['input']>;
  super?: InputMaybe<IdentityWhereInput>;
  super_isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type IdentitySubsConnection = {
  __typename?: 'IdentitySubsConnection';
  edges: Array<IdentitySubEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type IdentityWhereInput = {
  AND?: InputMaybe<Array<IdentityWhereInput>>;
  OR?: InputMaybe<Array<IdentityWhereInput>>;
  account?: InputMaybe<AccountWhereInput>;
  account_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  additional_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  display_contains?: InputMaybe<Scalars['String']['input']>;
  display_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  display_endsWith?: InputMaybe<Scalars['String']['input']>;
  display_eq?: InputMaybe<Scalars['String']['input']>;
  display_gt?: InputMaybe<Scalars['String']['input']>;
  display_gte?: InputMaybe<Scalars['String']['input']>;
  display_in?: InputMaybe<Array<Scalars['String']['input']>>;
  display_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  display_lt?: InputMaybe<Scalars['String']['input']>;
  display_lte?: InputMaybe<Scalars['String']['input']>;
  display_not_contains?: InputMaybe<Scalars['String']['input']>;
  display_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  display_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  display_not_eq?: InputMaybe<Scalars['String']['input']>;
  display_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  display_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  display_startsWith?: InputMaybe<Scalars['String']['input']>;
  email_contains?: InputMaybe<Scalars['String']['input']>;
  email_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  email_endsWith?: InputMaybe<Scalars['String']['input']>;
  email_eq?: InputMaybe<Scalars['String']['input']>;
  email_gt?: InputMaybe<Scalars['String']['input']>;
  email_gte?: InputMaybe<Scalars['String']['input']>;
  email_in?: InputMaybe<Array<Scalars['String']['input']>>;
  email_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  email_lt?: InputMaybe<Scalars['String']['input']>;
  email_lte?: InputMaybe<Scalars['String']['input']>;
  email_not_contains?: InputMaybe<Scalars['String']['input']>;
  email_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  email_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  email_not_eq?: InputMaybe<Scalars['String']['input']>;
  email_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  email_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  email_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  image_contains?: InputMaybe<Scalars['String']['input']>;
  image_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  image_endsWith?: InputMaybe<Scalars['String']['input']>;
  image_eq?: InputMaybe<Scalars['String']['input']>;
  image_gt?: InputMaybe<Scalars['String']['input']>;
  image_gte?: InputMaybe<Scalars['String']['input']>;
  image_in?: InputMaybe<Array<Scalars['String']['input']>>;
  image_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  image_lt?: InputMaybe<Scalars['String']['input']>;
  image_lte?: InputMaybe<Scalars['String']['input']>;
  image_not_contains?: InputMaybe<Scalars['String']['input']>;
  image_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  image_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  image_not_eq?: InputMaybe<Scalars['String']['input']>;
  image_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  image_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  image_startsWith?: InputMaybe<Scalars['String']['input']>;
  isKilled_eq?: InputMaybe<Scalars['Boolean']['input']>;
  isKilled_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  isKilled_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  judgement_eq?: InputMaybe<Judgement>;
  judgement_in?: InputMaybe<Array<Judgement>>;
  judgement_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  judgement_not_eq?: InputMaybe<Judgement>;
  judgement_not_in?: InputMaybe<Array<Judgement>>;
  legal_contains?: InputMaybe<Scalars['String']['input']>;
  legal_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  legal_endsWith?: InputMaybe<Scalars['String']['input']>;
  legal_eq?: InputMaybe<Scalars['String']['input']>;
  legal_gt?: InputMaybe<Scalars['String']['input']>;
  legal_gte?: InputMaybe<Scalars['String']['input']>;
  legal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  legal_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  legal_lt?: InputMaybe<Scalars['String']['input']>;
  legal_lte?: InputMaybe<Scalars['String']['input']>;
  legal_not_contains?: InputMaybe<Scalars['String']['input']>;
  legal_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  legal_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  legal_not_eq?: InputMaybe<Scalars['String']['input']>;
  legal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  legal_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  legal_startsWith?: InputMaybe<Scalars['String']['input']>;
  pgpFingerprint_contains?: InputMaybe<Scalars['String']['input']>;
  pgpFingerprint_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  pgpFingerprint_endsWith?: InputMaybe<Scalars['String']['input']>;
  pgpFingerprint_eq?: InputMaybe<Scalars['String']['input']>;
  pgpFingerprint_gt?: InputMaybe<Scalars['String']['input']>;
  pgpFingerprint_gte?: InputMaybe<Scalars['String']['input']>;
  pgpFingerprint_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pgpFingerprint_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  pgpFingerprint_lt?: InputMaybe<Scalars['String']['input']>;
  pgpFingerprint_lte?: InputMaybe<Scalars['String']['input']>;
  pgpFingerprint_not_contains?: InputMaybe<Scalars['String']['input']>;
  pgpFingerprint_not_containsInsensitive?: InputMaybe<
    Scalars['String']['input']
  >;
  pgpFingerprint_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  pgpFingerprint_not_eq?: InputMaybe<Scalars['String']['input']>;
  pgpFingerprint_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pgpFingerprint_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  pgpFingerprint_startsWith?: InputMaybe<Scalars['String']['input']>;
  riot_contains?: InputMaybe<Scalars['String']['input']>;
  riot_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  riot_endsWith?: InputMaybe<Scalars['String']['input']>;
  riot_eq?: InputMaybe<Scalars['String']['input']>;
  riot_gt?: InputMaybe<Scalars['String']['input']>;
  riot_gte?: InputMaybe<Scalars['String']['input']>;
  riot_in?: InputMaybe<Array<Scalars['String']['input']>>;
  riot_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  riot_lt?: InputMaybe<Scalars['String']['input']>;
  riot_lte?: InputMaybe<Scalars['String']['input']>;
  riot_not_contains?: InputMaybe<Scalars['String']['input']>;
  riot_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  riot_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  riot_not_eq?: InputMaybe<Scalars['String']['input']>;
  riot_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  riot_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  riot_startsWith?: InputMaybe<Scalars['String']['input']>;
  subs_every?: InputMaybe<IdentitySubWhereInput>;
  subs_none?: InputMaybe<IdentitySubWhereInput>;
  subs_some?: InputMaybe<IdentitySubWhereInput>;
  twitter_contains?: InputMaybe<Scalars['String']['input']>;
  twitter_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  twitter_endsWith?: InputMaybe<Scalars['String']['input']>;
  twitter_eq?: InputMaybe<Scalars['String']['input']>;
  twitter_gt?: InputMaybe<Scalars['String']['input']>;
  twitter_gte?: InputMaybe<Scalars['String']['input']>;
  twitter_in?: InputMaybe<Array<Scalars['String']['input']>>;
  twitter_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  twitter_lt?: InputMaybe<Scalars['String']['input']>;
  twitter_lte?: InputMaybe<Scalars['String']['input']>;
  twitter_not_contains?: InputMaybe<Scalars['String']['input']>;
  twitter_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  twitter_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  twitter_not_eq?: InputMaybe<Scalars['String']['input']>;
  twitter_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  twitter_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  twitter_startsWith?: InputMaybe<Scalars['String']['input']>;
  web_contains?: InputMaybe<Scalars['String']['input']>;
  web_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  web_endsWith?: InputMaybe<Scalars['String']['input']>;
  web_eq?: InputMaybe<Scalars['String']['input']>;
  web_gt?: InputMaybe<Scalars['String']['input']>;
  web_gte?: InputMaybe<Scalars['String']['input']>;
  web_in?: InputMaybe<Array<Scalars['String']['input']>>;
  web_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  web_lt?: InputMaybe<Scalars['String']['input']>;
  web_lte?: InputMaybe<Scalars['String']['input']>;
  web_not_contains?: InputMaybe<Scalars['String']['input']>;
  web_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  web_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  web_not_eq?: InputMaybe<Scalars['String']['input']>;
  web_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  web_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  web_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export enum Judgement {
  Erroneous = 'Erroneous',
  FeePaid = 'FeePaid',
  KnownGood = 'KnownGood',
  LowQuality = 'LowQuality',
  OutOfDate = 'OutOfDate',
  Reasonable = 'Reasonable',
  Unknown = 'Unknown',
}

export type NativeTransfer = {
  __typename?: 'NativeTransfer';
  amount: Scalars['BigInt']['output'];
  blockNumber: Scalars['Int']['output'];
  extrinsicHash?: Maybe<Scalars['String']['output']>;
  from: Account;
  id: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['DateTime']['output'];
  to: Account;
};

export type NativeTransferEdge = {
  __typename?: 'NativeTransferEdge';
  cursor: Scalars['String']['output'];
  node: NativeTransfer;
};

export enum NativeTransferOrderByInput {
  AmountAsc = 'amount_ASC',
  AmountDesc = 'amount_DESC',
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberDesc = 'blockNumber_DESC',
  ExtrinsicHashAsc = 'extrinsicHash_ASC',
  ExtrinsicHashDesc = 'extrinsicHash_DESC',
  FromIdAsc = 'from_id_ASC',
  FromIdDesc = 'from_id_DESC',
  FromPublicKeyAsc = 'from_publicKey_ASC',
  FromPublicKeyDesc = 'from_publicKey_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  SuccessAsc = 'success_ASC',
  SuccessDesc = 'success_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  ToIdAsc = 'to_id_ASC',
  ToIdDesc = 'to_id_DESC',
  ToPublicKeyAsc = 'to_publicKey_ASC',
  ToPublicKeyDesc = 'to_publicKey_DESC',
}

export type NativeTransferWhereInput = {
  AND?: InputMaybe<Array<NativeTransferWhereInput>>;
  OR?: InputMaybe<Array<NativeTransferWhereInput>>;
  amount_eq?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_eq?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_eq?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  extrinsicHash_contains?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_endsWith?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_eq?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_gt?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_gte?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  extrinsicHash_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  extrinsicHash_lt?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_lte?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_not_containsInsensitive?: InputMaybe<
    Scalars['String']['input']
  >;
  extrinsicHash_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_not_eq?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  extrinsicHash_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_startsWith?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<AccountWhereInput>;
  from_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  success_eq?: InputMaybe<Scalars['Boolean']['input']>;
  success_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  success_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
  timestamp_eq?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gt?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gte?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  timestamp_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  timestamp_lt?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_lte?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  to?: InputMaybe<AccountWhereInput>;
  to_isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type NativeTransfersConnection = {
  __typename?: 'NativeTransfersConnection';
  edges: Array<NativeTransferEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Scalars['String']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  accountById?: Maybe<Account>;
  /** @deprecated Use accountById */
  accountByUniqueInput?: Maybe<Account>;
  accounts: Array<Account>;
  accountsConnection: AccountsConnection;
  identities: Array<Identity>;
  identitiesConnection: IdentitiesConnection;
  identityById?: Maybe<Identity>;
  /** @deprecated Use identityById */
  identityByUniqueInput?: Maybe<Identity>;
  identitySubById?: Maybe<IdentitySub>;
  /** @deprecated Use identitySubById */
  identitySubByUniqueInput?: Maybe<IdentitySub>;
  identitySubs: Array<IdentitySub>;
  identitySubsConnection: IdentitySubsConnection;
  nativeTransferById?: Maybe<NativeTransfer>;
  /** @deprecated Use nativeTransferById */
  nativeTransferByUniqueInput?: Maybe<NativeTransfer>;
  nativeTransfers: Array<NativeTransfer>;
  nativeTransfersConnection: NativeTransfersConnection;
  squidStatus?: Maybe<SquidStatus>;
  stakingRewardById?: Maybe<StakingReward>;
  /** @deprecated Use stakingRewardById */
  stakingRewardByUniqueInput?: Maybe<StakingReward>;
  stakingRewards: Array<StakingReward>;
  stakingRewardsConnection: StakingRewardsConnection;
  transferById?: Maybe<Transfer>;
  /** @deprecated Use transferById */
  transferByUniqueInput?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  transfersConnection: TransfersConnection;
};

export type QueryAccountByIdArgs = {
  id: Scalars['String']['input'];
};

export type QueryAccountByUniqueInputArgs = {
  where: WhereIdInput;
};

export type QueryAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AccountOrderByInput>>;
  where?: InputMaybe<AccountWhereInput>;
};

export type QueryAccountsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<AccountOrderByInput>;
  where?: InputMaybe<AccountWhereInput>;
};

export type QueryIdentitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<IdentityOrderByInput>>;
  where?: InputMaybe<IdentityWhereInput>;
};

export type QueryIdentitiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<IdentityOrderByInput>;
  where?: InputMaybe<IdentityWhereInput>;
};

export type QueryIdentityByIdArgs = {
  id: Scalars['String']['input'];
};

export type QueryIdentityByUniqueInputArgs = {
  where: WhereIdInput;
};

export type QueryIdentitySubByIdArgs = {
  id: Scalars['String']['input'];
};

export type QueryIdentitySubByUniqueInputArgs = {
  where: WhereIdInput;
};

export type QueryIdentitySubsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<IdentitySubOrderByInput>>;
  where?: InputMaybe<IdentitySubWhereInput>;
};

export type QueryIdentitySubsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<IdentitySubOrderByInput>;
  where?: InputMaybe<IdentitySubWhereInput>;
};

export type QueryNativeTransferByIdArgs = {
  id: Scalars['String']['input'];
};

export type QueryNativeTransferByUniqueInputArgs = {
  where: WhereIdInput;
};

export type QueryNativeTransfersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<NativeTransferOrderByInput>>;
  where?: InputMaybe<NativeTransferWhereInput>;
};

export type QueryNativeTransfersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<NativeTransferOrderByInput>;
  where?: InputMaybe<NativeTransferWhereInput>;
};

export type QueryStakingRewardByIdArgs = {
  id: Scalars['String']['input'];
};

export type QueryStakingRewardByUniqueInputArgs = {
  where: WhereIdInput;
};

export type QueryStakingRewardsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<StakingRewardOrderByInput>>;
  where?: InputMaybe<StakingRewardWhereInput>;
};

export type QueryStakingRewardsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<StakingRewardOrderByInput>;
  where?: InputMaybe<StakingRewardWhereInput>;
};

export type QueryTransferByIdArgs = {
  id: Scalars['String']['input'];
};

export type QueryTransferByUniqueInputArgs = {
  where: WhereIdInput;
};

export type QueryTransfersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TransferOrderByInput>>;
  where?: InputMaybe<TransferWhereInput>;
};

export type QueryTransfersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<TransferOrderByInput>;
  where?: InputMaybe<TransferWhereInput>;
};

export type SquidStatus = {
  __typename?: 'SquidStatus';
  /** The height of the processed part of the chain */
  height?: Maybe<Scalars['Int']['output']>;
};

export type StakingReward = {
  __typename?: 'StakingReward';
  account: Account;
  amount: Scalars['BigInt']['output'];
  blockNumber: Scalars['Int']['output'];
  era?: Maybe<Scalars['Int']['output']>;
  extrinsicHash?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
  validatorId?: Maybe<Scalars['String']['output']>;
};

export type StakingRewardEdge = {
  __typename?: 'StakingRewardEdge';
  cursor: Scalars['String']['output'];
  node: StakingReward;
};

export enum StakingRewardOrderByInput {
  AccountIdAsc = 'account_id_ASC',
  AccountIdDesc = 'account_id_DESC',
  AccountPublicKeyAsc = 'account_publicKey_ASC',
  AccountPublicKeyDesc = 'account_publicKey_DESC',
  AmountAsc = 'amount_ASC',
  AmountDesc = 'amount_DESC',
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberDesc = 'blockNumber_DESC',
  EraAsc = 'era_ASC',
  EraDesc = 'era_DESC',
  ExtrinsicHashAsc = 'extrinsicHash_ASC',
  ExtrinsicHashDesc = 'extrinsicHash_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  ValidatorIdAsc = 'validatorId_ASC',
  ValidatorIdDesc = 'validatorId_DESC',
}

export type StakingRewardWhereInput = {
  AND?: InputMaybe<Array<StakingRewardWhereInput>>;
  OR?: InputMaybe<Array<StakingRewardWhereInput>>;
  account?: InputMaybe<AccountWhereInput>;
  account_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  amount_eq?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_eq?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_eq?: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  era_eq?: InputMaybe<Scalars['Int']['input']>;
  era_gt?: InputMaybe<Scalars['Int']['input']>;
  era_gte?: InputMaybe<Scalars['Int']['input']>;
  era_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  era_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  era_lt?: InputMaybe<Scalars['Int']['input']>;
  era_lte?: InputMaybe<Scalars['Int']['input']>;
  era_not_eq?: InputMaybe<Scalars['Int']['input']>;
  era_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  extrinsicHash_contains?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_endsWith?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_eq?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_gt?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_gte?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  extrinsicHash_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  extrinsicHash_lt?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_lte?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_not_containsInsensitive?: InputMaybe<
    Scalars['String']['input']
  >;
  extrinsicHash_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_not_eq?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  extrinsicHash_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  extrinsicHash_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  timestamp_eq?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gt?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gte?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  timestamp_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  timestamp_lt?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_lte?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  validatorId_contains?: InputMaybe<Scalars['String']['input']>;
  validatorId_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  validatorId_endsWith?: InputMaybe<Scalars['String']['input']>;
  validatorId_eq?: InputMaybe<Scalars['String']['input']>;
  validatorId_gt?: InputMaybe<Scalars['String']['input']>;
  validatorId_gte?: InputMaybe<Scalars['String']['input']>;
  validatorId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  validatorId_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  validatorId_lt?: InputMaybe<Scalars['String']['input']>;
  validatorId_lte?: InputMaybe<Scalars['String']['input']>;
  validatorId_not_contains?: InputMaybe<Scalars['String']['input']>;
  validatorId_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  validatorId_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  validatorId_not_eq?: InputMaybe<Scalars['String']['input']>;
  validatorId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  validatorId_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  validatorId_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type StakingRewardsConnection = {
  __typename?: 'StakingRewardsConnection';
  edges: Array<StakingRewardEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Transfer = {
  __typename?: 'Transfer';
  account: Account;
  direction?: Maybe<TransferDirection>;
  id: Scalars['String']['output'];
  transfer?: Maybe<NativeTransfer>;
};

export enum TransferDirection {
  From = 'From',
  To = 'To',
}

export type TransferEdge = {
  __typename?: 'TransferEdge';
  cursor: Scalars['String']['output'];
  node: Transfer;
};

export enum TransferOrderByInput {
  AccountIdAsc = 'account_id_ASC',
  AccountIdDesc = 'account_id_DESC',
  AccountPublicKeyAsc = 'account_publicKey_ASC',
  AccountPublicKeyDesc = 'account_publicKey_DESC',
  DirectionAsc = 'direction_ASC',
  DirectionDesc = 'direction_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TransferAmountAsc = 'transfer_amount_ASC',
  TransferAmountDesc = 'transfer_amount_DESC',
  TransferBlockNumberAsc = 'transfer_blockNumber_ASC',
  TransferBlockNumberDesc = 'transfer_blockNumber_DESC',
  TransferExtrinsicHashAsc = 'transfer_extrinsicHash_ASC',
  TransferExtrinsicHashDesc = 'transfer_extrinsicHash_DESC',
  TransferIdAsc = 'transfer_id_ASC',
  TransferIdDesc = 'transfer_id_DESC',
  TransferSuccessAsc = 'transfer_success_ASC',
  TransferSuccessDesc = 'transfer_success_DESC',
  TransferTimestampAsc = 'transfer_timestamp_ASC',
  TransferTimestampDesc = 'transfer_timestamp_DESC',
}

export type TransferWhereInput = {
  AND?: InputMaybe<Array<TransferWhereInput>>;
  OR?: InputMaybe<Array<TransferWhereInput>>;
  account?: InputMaybe<AccountWhereInput>;
  account_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  direction_eq?: InputMaybe<TransferDirection>;
  direction_in?: InputMaybe<Array<TransferDirection>>;
  direction_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  direction_not_eq?: InputMaybe<TransferDirection>;
  direction_not_in?: InputMaybe<Array<TransferDirection>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  transfer?: InputMaybe<NativeTransferWhereInput>;
  transfer_isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TransfersConnection = {
  __typename?: 'TransfersConnection';
  edges: Array<TransferEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type WhereIdInput = {
  id: Scalars['String']['input'];
};

export type GetTransfersByAccountQueryVariables = Exact<{
  where: TransferWhereInput;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  orderBy: Array<TransferOrderByInput> | TransferOrderByInput;
}>;

export type GetTransfersByAccountQuery = {
  __typename?: 'Query';
  transfers: Array<{
    __typename?: 'Transfer';
    id: string;
    direction?: TransferDirection | null;
    transfer?: {
      __typename?: 'NativeTransfer';
      amount: any;
      blockNumber: number;
      extrinsicHash?: string | null;
      id: string;
      success: boolean;
      timestamp: any;
      from: { __typename?: 'Account'; id: string };
      to: { __typename?: 'Account'; id: string };
    } | null;
  }>;
};

export const GetTransfersByAccount = gql`
  query GetTransfersByAccount(
    $where: TransferWhereInput!
    $limit: Int!
    $offset: Int!
    $orderBy: [TransferOrderByInput!]!
  ) {
    transfers(
      where: $where
      limit: $limit
      offset: $offset
      orderBy: $orderBy
    ) {
      id
      direction
      transfer {
        amount
        blockNumber
        extrinsicHash
        from {
          id
        }
        id
        success
        timestamp
        to {
          id
        }
      }
    }
  }
`;
