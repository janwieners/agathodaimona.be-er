#!/usr/local/bin/perl
open (LIST,"func.txt");
#Creating the introsite
open(KLEIO,">index.htm");
open (FN,">fn.htm");
open (MAIN,">main.htm");
print KLEIO "<html>\n";
print KLEIO "<HEAD>\n";
print KLEIO "<TITLE>Kleio<\/TITLE>\n";
print KLEIO "<\/HEAD>\n";
print KLEIO "<FRAMESET COLS=\"20%, \*\" BORDER=4>\n";
print KLEIO "<BASE TARGET=\"_top\">\n";
print KLEIO "<FRAME SRC=\"fn.htm\">\n";
print KLEIO "<FRAME SRC=\"main.htm\" name=\"mw\">\n";  
print KLEIO "<\/FRAMESET>\n";
print KLEIO "<body>\n";
print KLEIO "<\/BODY>\n";
print KLEIO "<\/HTML>\n";
close(KLEIO);
print MAIN "<html><HEAD>\n";
print MAIN "<TITLE>Intro<\/TITLE>\n";
print MAIN "<\/HEAD>\n";
print MAIN "<body>Introduction\n";
print MAIN "<\/BODY>\n";
print MAIN "<\/HTML>\n";
close (MAIN);

print FN "<html><head>\n";
print FN "<title>Functions<\/title>\n";
print FN "<\/head><body><p>\n";
print FN "<b>Functions:</b><p>\n";
@list = <LIST>;
$list = join("",@list);
@list = split(/<\/function>/,$list);
foreach $j(@list){
    $j =~ s/\n/ZZ/g;
    $j =~ s/<keylist>/<ul>Keylist:/g;
    $j =~ s/<\/keylist>/<\/ul>/g;
    $j =~ s/<key>/<li>/g;
    $j =~ s/<\/keylist>//g;
    $name = $j;
    $name =~ s/\s*<function>\s*//;
    $name =~ s/[^<name>]*<name>//;
    $name =~ s/<\/name>.*//;
    $name =~ s/ZZ//g;
    $file = $name;
    $file =~ s/\s//g;
    $file =~ s/^element/elem/;
    $file =~ s/^group/grou/;
    $file =~ s/(.{8}).*/\1/;
    $file = $file.".htm";
    print FN "<a href=\"$file\" target=\"mw\">$name<\/a><br>\n";
    open (FUN, ">$file");
    print FUN "<html><head>\n";
    print FUN "<title>Functions<\/title>\n";
    print FUN "<\/head><body><p>\n";  
    print FUN "<p><b>Name:</b> $name \n";
    $input = $j;
    $input =~ s/.*<input>//;
    $input =~ s/<\/input>.*//;
    $input =~ s/ZZ//g;
    print FUN "<p><b>Input:</b> $input\n";    
    $output = $j;
    @output = split(/ZZ/,$output);
    foreach $o(@output){
        if ($o =~ /<output>/){
           $o =~ s/<output>//;
           $o =~ s/<\/output>//;
           print FUN "<p><b>Output:</b> $o\n";
       }     
    }
    $def = $j;
    $def =~ s/.*<definition>//;
    $def =~ s/<\/definition>.*//;
    $def =~ s/ZZ//g;
    print FUN "<p><b>Definition:</b> $def\n";
    
    print FUN "<p><b>Argumentlist:</b>\n";
    $arg = $j;
    $arg =~ s/.*<argumentlist>//;
    $arg =~ s/<\/argumentlist>.*//;
    if ($arg !~ /</){
       $arg =~ s/ZZ//g;
       print FUN "$arg\n";
    }
    

    if ($arg =~ /<required>/){
       @req = split(/<\/required>/,$arg);
       foreach $r(@req){
          if ($r =~ /<required>/){
              push (@r,$r);
          }  
       }
       if (@r > 0){
          $num = 1;
          while($num <= @r){
             #if ($r[$num-1] =~ /<keylist>/){
              #  $r[$num-1] =~ s/<keylist>//;
               # $r[$num-1] =~ s/<\/keylist>//;
                #@key = split (/<\/key>/,$r[$num-1]);
              #}

             $r[$num-1] =~ s/ZZ/\n/g;
             print FUN "<p>Argument No $num (<i>required<\/i>)\n";
             #if (@key > 0){
              #   print FUN "Keylist:<ul>\n";
               #  foreach $k(@key){
                #     $k =~ s/<key>//;
                 #    $k =~ s/<\/key>//;
                  #   $k =~ s/ZZ/\n/g;
                   #  print FUN "<li>$k\n";
                 #}
                 #print FUN "</ul>\n";
             #}
             #else{
                print FUN $r[$num -1],"\n";
             #}
             $num++;
          }
       }
    }
    if ($arg =~ /<optional>/){
       @opt = split(/<\/optional>/,$arg);
       foreach $op(@opt){
          if ($op =~ /<optional>/){
              push (@op,$op);
          }  
       }
       if (@op > 0){
          $num = 1;
          while ($num <= @op){
             #if ($op[$num-1] =~ /<keylist>/){
              #  $op[$num-1] =~ s/<keylist>//;
               # $op[$num-1] =~ s/<\/keylist>//;
                #@key = split (/<\/key>/,$op[$num-1]);
              #}

             $n = 0;
             $n = @r+$num;
             $op[$num-1] =~ s/ZZ/\n/g;
             print FUN "<p>Argument No $n (<i>optional<\/i>)\n";
             #if (@key > 0){
              #   print FUN "Keylist:<ul>\n";
               #  foreach $k(@key){
                #     $k =~ s/<key>//;
                 #    $k =~ s/<\/key>//;
                  #   $k =~ s/ZZ/\n/g;
                  #   print FUN "<li>$k\n";
                 #}
                 #print FUN "</ul>\n";
             #}
             #else{
                  print FUN $op[$num-1],"\n";
             #}
             $num++;
          }
       }
    }

    $disc = $j;
    $disc =~ s/.*<discussion>//;
    $disc =~ s/<\/discussion>.*//;
    $disc =~ s/ZZ//g;
    print FUN "<p><b>Discussion:</b> $disc\n";
    
}
print FN "<\/BODY>\n";
print FN "<\/HTML>\n";

close (FN);
close (LIST);
exit 0;
