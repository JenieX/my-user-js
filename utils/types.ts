/** Checkbox prompt Choice */
export interface Choice {
  name: string,
  value?: boolean | number | string,
  checked?: boolean,
  disabled?: boolean | string,
}

/** JSON file like object, with each key as type "any" or the provided type */
export interface JSONLike<T = any> {
  [key: string]: T,
}

export type Strings = string[] | string | undefined;

export interface ListFoldersOptions {
  /** The absolute path of the folder that contains your targets */
  folderPath: string,

  /** If defined, it will return the absolute path of each folder, instead of only its name */
  getFullPath?: true,
}

export interface ListFilesOptions extends ListFoldersOptions {
  /**
   * A list of extension that is if provided, only files with extensions that
   * are in this list will be returned.
   *
   * ```js
   * // Example
   * filter = ['.css', '.html'];
   * ```
   */
  filter?: string[],
}

export interface DeleteFilesOptions extends Omit<ListFilesOptions, 'getFullPath'> {}
