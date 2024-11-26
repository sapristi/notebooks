# notebooks

# How to use

- `pdm run voici serve notebooks/delaunay.ipynb  --strip_sources=False --template custom` to compile and serve voici notebooks
- `pdm run jupyter nbconvert --to=html --template lab_test_toc notebooks/delaunay.ipynb` to compile to html with nbonvert
