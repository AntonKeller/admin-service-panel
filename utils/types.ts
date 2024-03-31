interface TContentObject {
  id: Number,
  title: String,
  textContent: Array<String>,
  enums: Array<String>,
  gridEnums?: String[][],
  underline: Boolean
}

export interface TTab {
  id: Number,
  title: String,
  sub: Boolean,
}

export interface TTabContent {
  id: (Number | null),
  content: Array<TContentObject>
}

export interface Tlink {
  id: Number,
  title: string,
  description: string,
  url: string,
}

export interface ratingButton {
  id: Number,
  title: String,
  year: Number,
}

interface ratingKey {
  title: String,
  value: String,
}

export interface ratingDescription {
  id: Number,
  year: Number,
  keys: Array<ratingKey>
}
