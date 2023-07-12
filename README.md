# Elm build action 

This action sets up an Elm environment to use with projects requiring Elm. 
It allows you to use the `elm` command in your workflow.

## Inputs
 - `elm-version` - Elm version. Default `"0.19.1"`.
 - `elm-home` - Folder where elm will cache downloaded packages. Default `"~/elm_home"`. 
 - `cache` - Do cache for `ELM_HOME` and elm compiler. Default `true`.
## Outputs

 - `elm-home` - folder set for cache


## Example usage

    steps:
    - uses: justgook/setup-elm@1.2.1
    - run: elm make src/Main.elm
