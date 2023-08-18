export interface CreateItemOpt {
  label: string,
  template?: string,

  /** The part the will replace the `%s` in the template */
  replacement?: string,

  className?: string,
}
