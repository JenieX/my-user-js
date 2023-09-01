export type Avatars = Record<string, string>;

export type Elements = NodeListOf<HTMLAnchorElement>;

export interface AddAvatarsOpt {
  avatars: Avatars,
  elements: Elements,
}
