# Elm build action 

This action sets up an Elm environment to use with projects requiring Elm. 
It allows you to use the `elm` command in your workflow.

## Inputs
 - `elm-version` - Elm version. Default `"0.19.1"`.
 - `elm-home` - folder where elm will cache downloaded packages.

## Outputs

 - `elm-home` - folder set for cache


## Example usage

    steps:
    - uses: justgook/elm-make@v1
    - run: elm make src/Main.elm
