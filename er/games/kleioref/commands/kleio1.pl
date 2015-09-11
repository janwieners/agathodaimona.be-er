#!/usr/local/bin/perl
open (LIST,"doc.txt");
#Creating the introsite
open (KLEIO,">index.htm");
open (COM,">com.htm");
open (MAIN,">main.htm");
#make a list of the commandnames
$line = <LIST>;
while ($line ne ""){
   chop $line;
   if ($line =~ /<command>/){
       $line = <LIST>; 
       chop $line;
       if ($line =~ /<name>/){
          $line =~ s/<[^>]*>//g;
          $line =~ s/\s//g;
          push (@klist,$line);
       }#endif ($line =~ /<name>
   }#end
   $line = <LIST>;
   chop $line;
}#endwhile ($line ne
close (LIST);
print KLEIO "<html>\n";
print KLEIO "<HEAD>\n";
print KLEIO "<TITLE>Kleio<\/TITLE>\n";
print KLEIO "<\/HEAD>\n";
print KLEIO "<FRAMESET COLS=\"15%, \*\" BORDER=4>\n";
print KLEIO "<BASE TARGET=\"_top\">\n";
print KLEIO "<FRAME SRC=\"com.htm\">\n";
print KLEIO "<FRAME SRC=\"main.htm\">\n";  
print KLEIO "<\/FRAMESET>\n";
print KLEIO "<body bgcolor=\"\#ffffff\">\n";
print KLEIO "<\/BODY>\n";
print KLEIO "<\/HTML>\n";
close(KLEIO);

print COM "<html><head>\n";
print COM "<title>Commands<\/title>\n";
print COM "<\/head><body bgcolor=\"\#ffffff\"><p>\n";
print COM "<p><a href=\"..\/..\/\" target=\"_top\">\n";
print COM "<img src=\"logo2.gif\" border=0><\/a><p>\n";
foreach $i(@klist){
   chop;
   print COM '<a href="',$i,'/" target ="_top">',$i,"</a><br>\n";
}#end
print COM "<\/body><\/html>\n";
close (COM);

print MAIN "<html><HEAD>\n";
print MAIN "<TITLE>Intro<\/TITLE>\n";
print MAIN "<\/HEAD>\n";
print MAIN "<body bgcolor=\"\#ffffff\">Introduction\n";
print MAIN "<\/BODY>\n";
print MAIN "<\/HTML>\n";
close (MAIN);

#I make a dir for each name and create a framepage
foreach $i(@klist){
   chop;
   $i =~ s/\s//g;
   mkdir("$i",0777);
   open (IND,">$i\/index.htm");
   open (PAR, ">$i\/parlist.htm");
   print IND "<html>\n";
   print IND "<HEAD>\n";
   print IND "<TITLE>",$i,"<\/TITLE>\n";
   print IND "<\/HEAD>\n";
   print IND "<FRAMESET COLS=\"15%, *\" BORDER=4>\n";
   print IND "<BASE TARGET=\"_top\">\n";
   print IND "<FRAME SRC=\"parlist.htm\">\n";
   print IND "<FRAMESET ROWS=\"40%, *\">\n";
   print IND "<FRAME SRC=\"disc.htm\">\n";
   #print IND "<FRAMESET COLS=\"20%, *\">\n";
   print IND "<FRAME SRC=\"partext.htm\" name=\"part\">\n";
   #print IND "<\/FRAMESET>\n";
   print IND "<\/FRAMESET>\n";
   print IND "<\/FRAMESET>\n";
   print IND "<body bgcolor=\"\#ffffff\">\n";
   print IND "<\/BODY>\n";
   print IND "<\/HTML>\n";
   close IND;
   open (PT,">$i\/partext.htm");
   print PT "<html>\n";
   print PT "<HEAD>\n";
   print PT "<TITLE>Description<\/TITLE>\n";
   print PT "<\/HEAD><body bgcolor=\"\#ffffff\">\n";
   print PT "Choose a parameter!\n";
   print PT "<\/BODY><\/HTML>\n";
   close (PT);
   open (TEXT,">$i\/disc.htm")||die("could not open $i");
   print TEXT "<html>\n";
   print TEXT "<HEAD>\n";
   print TEXT "<TITLE>Description<\/TITLE>\n";
   print TEXT "<\/HEAD><body bgcolor=\"\#ffffff\">\n";
   open (LIST,"doc.txt");
   @list = <LIST>;
   $list = join("",@list);
   @list = split(/<\/command>/,$list);
   foreach $j(@list){
      $j =~ s/\n//g;
      $cont = $j;
      $cont =~ s/.*<contextlist>//;
      $cont =~ s/<\/contextlist>.*//;
      #print $cont,"\n***\n";
      if ($j !~ /<contextlist>/){
           $cont = "";
      }
      $j =~ s/<contextlist>.*<\/contextlist>//;
      #print $j;
      $navn = $j;
      $navn =~ s/<command>\s*//;
      $navn =~ s/[^<name>]*<name>//;
      $navn =~ s/<\/name>.*//;
      $navn =~ s/\s*//g;
      push (@navn,$j); 
      
      if ($navn eq $i){
        
         $type = $j;
         $type =~ s/.*<type>//;
         $type =~ s/<\/type>.*//;
         $type =~ s/\s*//;
         $type =~ s/\s*^//;
         $status = $j;
         $status =~ s/.*<status>//;
         $status =~ s/<\/status>.*//;
         $status =~ s/\s*//;
         $status =~ s/\s*^//;
         $general = $j;
         $general =~ s/.*<general>//;
         $general =~ s/<\/general>.*//;
         $general =~ s/\s*//;
         $general =~ s/\s*^//;
         print TEXT "<p>Name: ",$navn,"\n";
         print TEXT "<p>Type: ",$type,"\n";
         print TEXT "<p>Status: ",$status,"\n";
         print TEXT "<p>General: ",$general,"\n";
         if ($cont ne ""){
            print TEXT "<a href=\"cont.htm\" target=\"_blank\">\n";
            print TEXT "<p>Directives.<\/a>\n";
         }
         print TEXT "<\/BODY>\n";
         print TEXT "<\/HTML>\n";
         close (TEXT);
         open (CONT, ">$i\/cont.htm");
         print CONT "<html>\n";
         print CONT "<HEAD>\n";
         print CONT "<TITLE>Contexts<\/TITLE>\n";
         print CONT "<\/HEAD>\n";
         print CONT "<FRAMESET COLS=\"15%, \*\" BORDER=4>\n";
         print CONT "<BASE TARGET=\"_top\">\n";
         print CONT "<FRAME SRC=\"contlist.htm\">\n";
         print CONT "<FRAME SRC=\"conttext.htm\" name=\"cont\">\n";  
         print CONT "<\/FRAMESET>\n";
         print CONT "<body bgcolor=\"\#ffffff\">\n";
         print CONT "<\/BODY>\n";
         print CONT "<\/HTML>\n";
         close(CONT);
         open (CONTLIST, ">$i\/contlist.htm" );
         print CONTLIST "<html>\n";
         print CONTLIST "<HEAD>\n";
         print CONTLIST "<TITLE>Contexts<\/TITLE>\n";
         print CONTLIST "<\/HEAD>\n";
         print CONTLIST "<body bgcolor=\"\#ffffff\">\n";
         print CONTLIST "<p><a href=\"..\/\" target=\"_top\">\n";
         print CONTLIST "<img src=\"..\/logo2.gif\" border=0><\/a>\n";
         print CONTLIST "<p><b>$i, contexts:</b>";
         
         print PAR "<html>\n";
         print PAR "<HEAD>\n";
         print PAR "<TITLE>Parameters<\/TITLE>\n";
         print PAR "<\/HEAD><body bgcolor=\"\#ffffff\">\n";
         print PAR "<p><a href=\"..\/\" target=\"_top\">\n";
         print PAR "<img src=\"..\/logo2.gif\" border=0><\/a><p>\n";
         print PAR "<b>Parameters<\/b><p>\n";
         $par = $j;
         $par =~ s/[^<parameterlist>]*<parameterlist>//;
         $par =~ s/<\/parameterlist>[^<\/parameterlist>]*//;
         @par = split(/<\/parameter>/,$par);
         foreach $k(@par){
            $pn = $k;
            $pn =~ s/.*<name>//;
            $pn =~ s/<\/name>.*//;
            #print $pn,"\n";
            $href = $pn;
            $href = $href.".htm";
            print PAR "<a href=\"$href\" target=\"part\">\n";
            print PAR $pn,"<\/a><br>\n";
            $pd = $pn.".htm";
            $pd1 = $pn."1.htm";
            $pd2 = $pn."2.htm";
            #$pd3 = $pn."3.htm";
            open (PD,">$i\/$pd");
            print PD "<html>\n";
            print PD "<HEAD>\n";
            print PD "<TITLE>$i,$pd<\/TITLE>\n";
            print PD "<\/HEAD>\n";
            if ($k =~ /<keyword>/){
                print PD "<FRAMESET ROWS=\"40%, *\" BORDER=2>\n";
                print PD "<FRAME SRC=\"$pd1\"> \n";
                #print PD "<FRAMESET COLS=\"20%, *\">\n";
                print PD "<FRAME SRC=\"$pd2\">\n";  
                #print PD "<FRAME SRC=\"$pd3\" name=\"w3\">\n";
                print PD "<\/FRAMESET>\n";
                #print PD "<\/FRAMESET>\n";
                print PD "<body bgcolor=\"\#ffffff\">\n";
                print PD "<\/BODY>\n";
                print PD "<\/HTML>\n";
                open (PD1,">$i\/$pd1");
                open (PD2,">$i\/$pd2");
                #open (PD3,">$i\/$pd3");
                print PD1 "<html>\n";
                print PD1 "<HEAD>\n";
                print PD1 "<TITLE>Parameterdescription<\/TITLE>\n";
                print PD1 "<\/HEAD><body bgcolor=\"\#ffffff\">\n";
                print PD1 "<b>Parameter </b>\n";
                print PD1 "<p>Name: ",$pn,"\n";
                $pt = $k;
                $pt =~ s/.*<parametertype>//;
                $pt =~ s/<\/parametertype>.*//;
                print PD1 "<p>Type: ",$pt,"\n";
                print PD1 "<\/BODY>\n";
                print PD1 "<\/HTML>\n";
                $pk = $k;
                $pk =~ s/.*<keywordlist>//;
                $pk =~ s/<\/keywordlist>.*//;
                @pk = split(/<\/keyword>/,$pk);
                print PD2 "<html>\n";
                print PD2 "<HEAD>\n";
                print PD2 "<TITLE>Parameterarguments<\/TITLE>\n";
                print PD2 "<\/HEAD><body bgcolor=\"\#ffffff\">\n";
                #print PD3 "<html>\n";
                #print PD3 "<HEAD>\n";
                #print PD3 "<TITLE>Parameterarguments<\/TITLE>\n";
                #print PD3 "<\/HEAD><body bgcolor=\"\#ffffff\">\n";
                print PD2 "<b>Arguments<\/b><br>\n";
                print PD2 "<b>for $pn<\/b><br>\n";
                foreach $j(@pk){
                @j = split(/<\/keyword>/,$j);
                foreach $l(@j){
                #print $l,"\n\n";
                 if ($l =~ /<keyword>/){
                   $l =~ s/<keyword>\s*(\S*).*/\1/;
                   #$arg = $pn.$l;
                   #$arg = $arg.".html";
                   #$arg =~ s/\s//g;
                   #$arg =~ s/\n//g;
                   if ($l =~ /\S/){
                     #print PD2 "<a href=\"$arg\" target=\"w3\">";
                     print PD2 $l, "<br>\n";
                   }#endif ($arg =~ /\S/){
                   print PD2 "<\/BODY>\n";
                   print PD2 "<\/HTML>\n"; 
                   #open (LAST, ">$i\/$arg");
                   #print LAST "<html>\n";
                   #print LAST "<HEAD>\n";
                   #print LAST "<TITLE>Parameterarguments<\/TITLE>\n";
                   #print LAST "<\/HEAD><body bgcolor=\"\#ffffff\">\n";
                   #print LAST $l,"<br>\n";
                   #print LAST "<\/BODY><\/HTML>\n";
                  }#endif($l=~ /<keyword/
                  #close(LAST);
               }#endforeach $l(@j){
             }#endforeach $j(@pk){
            }
            else{
                print PD "<html>\n";
                print PD "<HEAD>\n";
                print PD "<TITLE>Parameterdescription<\/TITLE>\n";
                print PD "<\/HEAD><body bgcolor=\"\#ffffff\">\n";
                print PD "<b>Parameter </b>\n";
                print PD "<p>Name: ",$pn,"\n";
                $pt = $k;
                $pt =~ s/.*<parametertype>//;
                $pt =~ s/<\/parametertype>.*//;
                print PD "<p>Type: ",$pt,"\n";
                print PD "<\/BODY>\n";
                print PD "<\/HTML>\n";
            }
          }#endforeach $k(@par){
          print PAR "<\/body><\/html>\n";
             close (PAR);
             close (PD);
             close (PD1);
             close (PD2);
             close (PD3);
           if ($cont ne ""){ 
            $contdesc = $cont;
            $contdesc =~ s/.*<contextdescription>//;
            $contdesc =~ s/<\/contextdescription>.*//;
            open (CONTTEXT, ">$i\/conttext.htm" );
            print CONTTEXT "<html>\n";
            print CONTTEXT "<HEAD>\n";
            print CONTTEXT "<TITLE>Contexts<\/TITLE>\n";
            print CONTTEXT "<\/HEAD>\n";
            print CONTTEXT "<body bgcolor=\"\#ffffff\">\n";
            print CONTTEXT "<p><b>$i<\/b>: <br>",$contdesc,"\n";
            print CONTTEXT "<\/BODY><\/HTML>\n";
            $cont =~ s/.*<\/contextdescription>//;
            @cont = split(/<\/context>/,$cont);
            foreach $c(@cont){
               $contnavn = $c;
               $contnavn =~ s/\n//g;
               $contnavn =~ s/[^<context>]*<context>//;
               $contnavn =~ s/[^<name>]*<name>//;
               $contnavn =~ s/<\/name>.*//;
               $contnavn =~ s/\s*//g;
              #print $contnavn,"\n***\n";
               if ($contnavn =~ /\S/){
                   push (@CONTLIST,$contnavn);
                   mkdir("$i/$contnavn", 0777);
                   print CONTLIST "<br><a href=\"$contnavn\/\" target=\"_top\">\n";
                   print CONTLIST $contnavn,"<\/a>\n";
                   $contd = $contnavn."d.htm";
                   $contt = $contnavn."t.htm";
                   open (NEWC,">$i\/$contnavn\/index.htm");
                   print NEWC "<HEAD>\n";
                   print NEWC "<TITLE>$contnavn<\/TITLE>\n";
                   print NEWC "<\/HEAD>\n";
                   print NEWC "<FRAMESET COLS=\"15\%, *\" BORDER=4>\n";
                   print NEWC "<BASE TARGET=\"_top\">\n";
                   print NEWC "<FRAME SRC=\"$contd\">\n";
                   print NEWC "<FRAME SRC=\"$contt\">\n";  
                   print NEWC "<\/FRAMESET>\n";
                   print NEWC "<body bgcolor=\"\#ffffff\">\n";
                   print NEWC "<\/BODY>\n";
                   print NEWC "<\/HTML>\n";
                   open (CONTT,">$i\/$contnavn\/$contt");
                   print CONTT "<TITLE>$contnavn<\/TITLE>\n";
                   print CONTT "<\/HEAD><body bgcolor=\"\#ffffff\">\n";
                   print CONTT "<b>$i:<p>Context:\n";
                   print CONTT "$contnavn<\/b>\n";
                   print CONTT "<p>Choose a directive!\n";
                   print CONTT "<\/HTML><\/BODY>\n";
                   close (CONTT);
                   $dirlist = $c;
                   $dirlist =~ s/\n//g;
                   $dirlist =~ s/.*<directivelist>//;
                   @dirlist = split(/<\/directive>/, $dirlist);
                   open (CONTD,">$i\/$contnavn\/$contd");
                   print CONTD "<TITLE>$contnavn<\/TITLE>\n";
                   print CONTD "<\/HEAD><body bgcolor=\"\#ffffff\">\n";
                   print CONTD "<p><a href=\"..\/..\/\" target=\"_top\">\n";
                   print CONTD "<img src=\"..\/..\/logo2.gif\" border=0><\/a><p>\n";
                   foreach $d(@dirlist){
                       $dirnavn = $d;
                       $dirnavn =~ s/<directive>\s*<name>//;
                       $dirnavn =~ s/([^<\/name>]*)<\/name>.*/\1/;
                       $dirnavn =~ s/\s//g;
                       $dirnavn =~s/<.*>//;
                       $dird = $dirnavn."d.htm";
                       $dird = $contnavn.$dird;
                       $dira = $dirnavn."a.htm";
                       $dira = $contnavn.$dira;
                       $dirb = $dirnavn."b.htm";
                       $dirb = $contnavn.$dirb;
                       if ($d =~ /<identical/){
                          $dirhref = "..\/..\/$dirnavn";
                       }
                       else{
                          $dirhref = $dirnavn.".htm";
                          $dirhref = $contnavn.$dirhref;
                          $dirhref =~ s/\s//g;
                      }
                      if ($dirnavn ne ""){
                         print CONTD "<a href=\"$dirhref\" target=\"_top\">$dirnavn<\/a><br>\n";
                         if ($d !~ /<identical/){
                            open (DIR,">$i\/$contnavn\/$dirhref");
                            print DIR "<HEAD>\n";
                            print DIR "<TITLE>$contnavn,$dirnavn<\/TITLE>\n";
                            print DIR "<\/HEAD>\n";
                            print DIR "<FRAMESET COLS=\"20%, *\" BORDER=2>\n";
                            print DIR "<FRAME SRC=\"$contd\"> \n";
                            print DIR "<FRAMESET ROWS=\"40%, *\" BORDER=2>\n";
                            print DIR "<FRAME SRC=\"$dird\">\n";
                            print DIR "<FRAMESET COLS=\"20%, *\">\n";                           
                            print DIR "<FRAME SRC=\"$dira\">\n";
                            print DIR "<FRAME SRC=\"$dirb\" name=\"w3\">\n";
                            print DIR "<\/FRAMESET>\n";
                            print DIR "<\/FRAMESET>\n";
                            print DIR "<\/FRAMESET>\n";
                            print DIR "<body bgcolor=\"\#ffffff\">\n";
                            print DIR "<\/BODY>\n";
                            print DIR "<\/HTML>\n";
                            open(DIRD,">$i\/$contnavn\/$dird");
                            open(DIRA,">$i\/$contnavn\/$dira");
                            open(DIRB,">$i\/$contnavn\/$dirb");
                            print DIRD "<html>\n";
                            print DIRD "<HEAD>\n";
                            print DIRD "<TITLE>$contnavn,$dirnavn<\/TITLE>\n";
                            print DIRD "<\/HEAD><body bgcolor=\"\#ffffff\">\n";
                            print DIRD "<b>$contnavn - Directive</b>\n";
                            print DIRD "<p>Name: ",$dirnavn,"\n";
                            $dstat = $d;
                            $dstat =~ s/.*<status>//;
                            $dstat =~ s/<\/status>.*//;
                            print DIRD "<p>Status: ",$dstat,"\n";
                            $dgeneral = $d;
                            $dgeneral =~ s/.*<general>//;
                            $dgeneral =~ s/<\/general>.*//;
                            print DIRD "<p>General: ",$dgeneral,"\n";
                            print DIRD "<\/BODY>\n";
                            print DIRD "<\/HTML>\n";
                            $dp = $d;
                            $dp =~ s/\n//g;
                            $dp =~ s/.*<parameterlist>//;
                            $dp =~ s/<\/parameterlist>[^<\/parameterlist>]*//;
                            @dp = split(/<\/parameter>/,$dp);
                            print DIRA "<html>\n";
                            print DIRA "<HEAD>\n";
                            print DIRA "<TITLE>Parameters<\/TITLE>\n";
                            print DIRA "<\/HEAD><body bgcolor=\"\#ffffff\">\n";
                            print DIRA "<p><b>$dirnavn - parameters</b><p>\n";
                            print DIRB "<html>\n";
                            print DIRB "<HEAD>\n";
                            print DIRB "<TITLE>Parameters<\/TITLE>\n";
                            print DIRB "<\/HEAD><body bgcolor=\"\#ffffff\">\n";
                            print DIRB "<p><b>Choose a parameter!<\/b>\n";
                            print DIRB "<\/body><\/html>\n";
                            close (DIRB);
                            foreach $i(@dp){
                               $pnavn = $i;
                               $pnavn =~ s/.*<name>//;
                               $pnavn =~ s/<\/name>.*//;
                               $pnavn =~ s/\s//g;
                               $pdir = $pnavn;
                               $pdir = $dirnavn.$pdir;
                               $pdir = $contnavn.$pdir;
                               $ph = $pnavn;
                               $ph = $ph.".htm";
                               $aph = "a".$ph;
                               $bph = "b".$ph;
                               #$cph = "c".$ph;
                               if ($pnavn =~ /\S/){
                                  print DIRA "<a href=\"..\/..\/$pdir\/\" target=\"w3\">\n";
                                  print DIRA "$pnavn<\/a><br>\n";
                                  mkdir("$pdir",0777);
                                  open (DPAR, ">$pdir\/index.htm");
                                  print DPAR "<html><head><title>$pnavn<\/title>\n";
                                  if ($i =~ /<keywordlist>/){
                                     print DPAR "<FRAMESET ROWS=\"40%, *\" BORDER=1>\n";
                                     print DPAR "<FRAME SRC=\"$aph\">\n";
                                     print DPAR "<FRAME SRC=\"$bph\">\n";
                                     print DPAR "<\/FRAMESET>\n";
                                     print DPAR "<\head><body><\/body><\/html>\n";
                                     open (DPARA, ">$pdir\/$aph");
                                     open (DPARB, ">$pdir\/$bph");
                                     print DPARA "<html><head><title>$pnavn<\/title>\n";
                                     print DPARA "<body>\n";
                                     print DPARA "<b>Parameter<\/b><p>\n";
                                     print DPARA "<b>Name:</b> $pnavn<p>\n";
                                     $type = $i;
                                     $type =~ s/.*<parametertype>//;
                                     $type =~ s/<\/parametertype>.*//;
                                     print DPARA "<b>Type:<\/b> $type<p>\n";
                                     print DPARA "<\/body><\/html>\n";
                                     print DPARB "<html><head><title>$pnavn<\/title>\n";
                                     print DPARB "<body>\n";
                                     print DPARB "<b>Keywords:<\/b><p>\n";
                                     $kw = $i;
                                     $kw =~ s/.*<keywordlist>//;
                                     $kw =~ s/<\/keywordlist>.*//;
                                     @kw = split(/<\/keyword>/,$kw);
                                     foreach $k(@kw){
                                        $k =~ s/<keyword>//;
                                        $k =~ s/\s//g;
                                        if ($k =~ /\S/){                                                                                                                                                                                                                                                                                                                                              print DPARB $k,"<br>\n";
                                        }
                                     }
                                  }
                                  else{
                                     print DPAR "<html><head><title>$pnavn<\/title>\n";
                                     print DPAR "<body>\n";
                                     print DPAR "<b>Parameter<\/b><p>\n";
                                     print DPAR "<b>Name:</b> $pnavn<p>\n";
                                     $type = $i;
                                     $type =~ s/.*<parametertype>//;
                                     $type =~ s/<parametertype>.*//;
                                     print DPAR "<b>Type:<\/b> $type<p>\n";
                                     print DPAR "<\/body><\/html>\n";
                                 }
                               }
                          }
                          print DIRA "<\/body><\/html>\n";
                          close(DIRA);
               
                       } 
                  }
                  
                 
              }#end foreach $d
             }
            }#endforeach $c(@cont)
              close(NEWC);
           }#endif ($j =~ /<directivelist>
           print CONTLIST "<\/BODY><\/HTML>\n";
           close (CONTLIST);
           print CONTTEXT "<\/BODY><\/HTML>\n";
          close (CONTTEXT);
         }#endif ($navn eq $i){
      
   }#endforeach $j(@list){
}#endforeach $i(@klist){
close (LIST);
exit 0;
