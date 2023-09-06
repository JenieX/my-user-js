/* eslint-disable max-len */

/** The type of the object that getItemInfo produces */
export interface ItemInfo {
  type: 'document' | 'index' | 'metadata' | 'script' | 'style' | undefined,

  /** The name of the user script that this item belongs to */
  owner: string,

  isAllowed?: boolean,
  isFile: boolean,
}

export interface BuildTaskOptions {
  /** A list of user scripts names */
  userScripts: string[],

  /** If set to true, it will trigger the watch task after the initial building */
  watch?: true,

  /** If set to true, it will trigger the lintTask */
  lint?: true,

  /** If set to true, it will trigger the cssTask */
  css?: true,

  /** If set to true, it will trigger the htmlTask */
  html?: true,

  /** If set to true, it will indicate that the build task was triggered by an external file  */
  autoTriggered?: true,
}

export interface WaitTaskOptions {
  delay: number,
}

export interface CleanTaskOptions {
  /** The distribution folder of the user script */
  distPath: string,

  /** If set to true, it will delete the style files */
  css?: true,

  /** If set to true, it will delete the document files */
  html?: true,
}

export interface CSSTaskOptions {
  /** The name of the user script */
  userScript: string,

  /** The distribution folder of the user script */
  distPath: string,
}

export interface HTMLTaskOptions extends CSSTaskOptions {}
export interface MetadataTaskOptions extends CSSTaskOptions {}

export interface BundleTaskOptions extends CSSTaskOptions {
  /** Ready list of style and document files located at the distribution folder */
  files: string[],
}

export interface OutputTaskOptions extends CSSTaskOptions {
  /** The developer bundle, that is the raw js output of Rollup */
  devBundle: string,

  /** The sourcemap for the developer bundle  */
  devBundleSourceMap: string,

  /** The linted version of the developer bundle including metadata block */
  userBundle?: string,
}

export interface LintTaskOptions {
  /** The developer bundle, that is the raw js output of Rollup */
  devBundle: string,

  metadataBlock: string,
}

export interface IncludeFileOptions extends Omit<BundleTaskOptions, 'userScript'> {
  renderedCode: string,
}

export type TasksOptions =
  | BuildTaskOptions
  | BundleTaskOptions
  | CleanTaskOptions
  | CSSTaskOptions
  | HTMLTaskOptions
  | LintTaskOptions
  | MetadataTaskOptions
  | OutputTaskOptions
  | WaitTaskOptions;

export type Task = (options: any) => any;

export interface UserScriptSpecificMetaData {
  name: string,
  version: string,
  description: string,
  match: string[],
  excludeMatch: string[],
  include: string[],
  exclude: string[],
  runAt: string,
  icon: string,
  grant?: string[],
  require?: string[],
  resource?: string[],
  docs: {
    description: string,
    usage: string,
    limitations: string,
  },
}

export interface RelatedScripts {
  userScript: string,
  userScriptAlias: string,
}

export interface GenerateReadMe {
  /** The name of the user script */
  userScript: string,

  /** The name of the user script folder */
  userScriptAlias: string,

  /** The full description of the user script */
  description?: string,

  /** Instructions on how to use this user script */
  usage?: string,

  limitations?: string,
  related: RelatedScripts[],
}
