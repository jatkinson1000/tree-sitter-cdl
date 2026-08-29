(dataset_id) @variable
(identifier) @variable

"netcdf" @function

[
 "types:"
 "dimensions:"
 "variables:"
 "data:"
 "group:"
] @module


(group (identifier) @function)
(groupname) @function


(comment) @comment

[
 (typeref)
 (type)
 "enum"
 "opaque"
 "compound"
] @type

; Color 'derived_type' identifiers as types
(derived_type (path (identifier) @type))

(nc_unlimited) @constant.builtin
(fill_value) @constant.builtin

(float) @number.float
(integer) @number
(byte) @number
(char) @character
(string) @string
(const_int) @number
(const_positive_int) @number

; Color variable 'dimension' identifiers as numbers
(dimension_spec
  (path
    (identifier) @number))

; Color vlen '*' dimension as number
(vlen_type
  "*" @number)

; Color attribute name identifiers as properties
(attribute
  name: (_) @property)

[
 "("
 ")"
 "{"
 "}"
] @punctuation.bracket

[
 ":"
 ","
 ";"
 "/"
] @punctuation.delimiter

[
"="
] @operator
