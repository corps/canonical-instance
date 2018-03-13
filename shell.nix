{ pkgs ? import <nixpkgs> {} }:

pkgs.stdenv.mkDerivation {
  name = "canonical-object";
  buildInputs = with pkgs; [ nodejs ];
}
