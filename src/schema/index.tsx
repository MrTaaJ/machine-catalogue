// interface ReactNodeArray extends Array<ReactNode> {}
// type ReactFragment = {} | ReactNodeArray
// type ReactNode = ReactChild | ReactFragment | boolean | null | undefined

export type LayoutSchema = {
  children: React.ReactNode | React.ReactNode[]
}
