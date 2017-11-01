#for f in *.ejs; do echo "$f"; done

#for f in *.ejs; do new=$(echo $f | sed -e 's/\.ejs$/\.hbrs/'); echo ${new}; done

convert() {
## Command to rename all the template files to "handlebars"
for f in $(ls $PWD | grep $1); do 
    new=$(echo $f | sed -e "s/$1/$2/"); 
##    new=$(echo $f | sed -e 's/$1/EXT/'); 
 ## Esto no funciona, pq con comillas simples no hay interpolación de variables !!
    mv -v $f $new; 
  done;
}

convert '..handlebars' '.handlebars' 
