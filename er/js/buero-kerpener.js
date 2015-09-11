// Jan Wieners
$(document).ready(function() {

    $(".clickme").click(function() {

        $("#connectgame").fadeIn(1000);

    });

});


// Kevin Wieland:
var board;
var LinkDirection={UP:0, DOWN:1, RIGHT:3, LEFT:4};
var LOCATION_PATTERN = /board_(\d+)_(\d+)/;

function arrayIndex(array, element){
    if (array.indexOf){
        return array.indexOf(element);
    }
    for(var i=array.length-1; i>=0; i--){
        if(array[i]==element){
            return i;
        }
    }
    return -1;
}

function Domino(a, b){
    this.a=a;
    this.b=b;
    this.locations = new Array();

    this.toString = function(){
        return a+"-"+b;
    }

    this.onLocation = function (locA, locB, isLinked){
        var cl = this.getClass();
        if (isLinked){
            this.locations.push(locA);
            this.locations.push(locB);
        } else {
            this.locations.splice(arrayIndex(this.locations, locA), 1);
            this.locations.splice(arrayIndex(this.locations, locB), 1);
        }
        var ok = this.locations.length<=2;
        for (var i in this.locations){
            this.locations[i].setDominoOk(ok);
        }
        var ncl = this.getClass();
        if (ncl!=cl){
            this.getHtmlElement().className=ncl;
        }
    }

    this.isOk = function(){
        return this.locations.length==2;
    }

    this.clear = function(){
        this.locations.length=0;
        this.getHtmlElement().className=this.getClass();
    }

    this.getId = function(){
        if (!this.id){
            this.id="piece_"+this.a+"_"+this.b;
        }
        return this.id;
    }

    this.getClass = function(){
        var ret='piece';
        if (this.locations.length>0){
            ret+=this.isOk()? 'Ok' : 'Error';
        }
        return ret;
    }

    this.getHtmlElement=function(){
        if (!this.htmlElement){
            this.htmlElement = document.getElementById(this.getId());
        }
        return this.htmlElement;
    }
}

function Cell(content, row, column){

    State={NORMAL:0, HIGHLIGHTED:1, LINKED:2, ERROR:3, SOLVED:4}

    this.id='board_'+row+'_'+column;
    this.state=State.NORMAL;
    this.linkDirection=LinkDirection.UP;
    this.link=null;
    this.number=content;
    this.toString = function(){
        return this.number;
    }
    this.getNumber = function(){
        return this.number;
    }
    this.isLinked = function(){
        return this.state>=State.LINKED;
    }
    this.isHighlighted = function(){
        return this.state==State.HIGHLIGHTED;
    }

    this.clear=function(){
        this.setNormal();
        this.getHtmlElement().onclick=board.mouseClick;
    }

    this.setHighlighted = function(direction, assoc){
        this.linkDirection = direction;
        this.state = State.HIGHLIGHTED;
        this.link = assoc;
        assoc.state = State.HIGHLIGHTED;
        assoc.link = this;
        switch(direction){
            case LinkDirection.UP:
                assoc.linkDirection=LinkDirection.DOWN;
                break;
            case LinkDirection.DOWN:
                assoc.linkDirection=LinkDirection.UP;
                break;
            case LinkDirection.RIGHT:
                assoc.linkDirection=LinkDirection.LEFT;
                break;
            case LinkDirection.LEFT:
                assoc.linkDirection=LinkDirection.RIGHT;
                break;
        }
        this.updateClass();
        assoc.updateClass();
    }

    this.setLinked = function(set){
        //can only be called after setHighlighted!
        this.state=set? State.LINKED : State.HIGHLIGHTED;
        this.link.state=this.state;
        this.updateClass();
        this.link.updateClass();
        return this.link;
    }

    this.setDominoOk = function(ok){
        var st = ok? State.LINKED : State.ERROR;
        if (st!=this.state){
            this.state=st;
            this.updateClass();
        }
    }

    this.setSolved = function(){
        this.state = State.SOLVED;
        this.updateClass();
        this.getHtmlElement().onclick=null;
    }

    this.setNormal = function(){
        this.state = State.NORMAL;
        this.updateClass();
        return this.link;
    }
    this.getId=function(){
        return this.id;
    }
    this.updateClass = function(){
        this.getHtmlElement().className=this.getClass();
    }
    this.getHtmlElement=function(){
        if (!this.htmlElement){
            this.htmlElement = document.getElementById(this.id);
        }
        return this.htmlElement;
    }
    this.getClass = function(){
        var ret;
        switch (this.state){
            case State.NORMAL:
                return "locNormal";
            case State.HIGHLIGHTED:
                ret="locHighlighted";
                break;
            case State.LINKED:
                ret="locLinked";
                break;
            case State.ERROR:
                ret="locError";
                break;
            case State.SOLVED:
                ret="locSolved";
                break;
        }
        switch(this.linkDirection){
            case LinkDirection.UP:
                return ret+"Up";
            case LinkDirection.DOWN:
                return ret+"Down";
            case LinkDirection.RIGHT:
                return ret+"Right";
            case LinkDirection.LEFT:
                return ret+"Left";
        }
    }
}

Cell.getCoordinates = function(id){
    refs = LOCATION_PATTERN.exec(id);
    return new Array(parseInt(refs[1]),parseInt(refs[2]))
}

function Board(t){

    var location = null;
    var locationCoordinates = null;

    this.mouseIn = function(event){
        refs = Cell.getCoordinates(event.target? event.target.id :
            event.srcElement.id);
        loc = this.locations[refs[0]][refs[1]];
        if (!loc.isLinked()){

            var search=new Array(	LinkDirection.DOWN, LinkDirection.RIGHT,
                LinkDirection.UP, LinkDirection.LEFT);
            if (locationCoordinates!=null){
                if (locationCoordinates[0]==refs[0]){
                    if (locationCoordinates[1]>refs[1]){
                        search=new Array(LinkDirection.RIGHT,LinkDirection.LEFT,
                            LinkDirection.DOWN, LinkDirection.UP);
                    } else {
                        search=new Array(LinkDirection.LEFT,LinkDirection.RIGHT,
                            LinkDirection.DOWN, LinkDirection.UP);
                    }
                } else if (locationCoordinates[1]==refs[1]){
                    if (locationCoordinates[0]>refs[0]){
                        search=new Array(LinkDirection.DOWN, LinkDirection.UP,
                            LinkDirection.RIGHT, LinkDirection.LEFT);
                    } else {
                        search=new Array(LinkDirection.UP, LinkDirection.DOWN,
                            LinkDirection.RIGHT, LinkDirection.LEFT);
                    }
                }
            }
            for (s in search){
                var row, col;
                switch(search[s]){
                    case LinkDirection.LEFT:
                        row=refs[0];
                        col=refs[1]-1;
                        break;
                    case LinkDirection.RIGHT:
                        row=refs[0];
                        col=refs[1]+1;
                        break;
                    case LinkDirection.UP:
                        row=refs[0]-1;
                        col=refs[1];
                        break;
                    case LinkDirection.DOWN:
                        row=refs[0]+1;
                        col=refs[1];
                        break;
                }
                if (row>=0 && row<this.locations.length &&
                    col>=0 && col<this.locations[0].length){
                    var assoc = this.locations[row][col];
                    if (!assoc.isLinked()){
                        loc.setHighlighted(search[s], assoc);
                        break;
                    }
                }
            }
        }

        location=loc;
        locationCoordinates=refs;
    }


    this.mouseClick = function(){
        function locate(a, b){
            if (a<b){
                var c=a;
                a=b;
                b=c;
            }
            while(a>0){
                b+=a--;
            }
            return board.pieces[b];
        }

        var nextLinked = !location.isLinked();
        if (!nextLinked || location.isHighlighted()){
            var assoc = location.setLinked(nextLinked);
            var piece=locate(location.getNumber(), assoc.getNumber());
            piece.onLocation(location, assoc, nextLinked);

            if (nextLinked){
                board.checkSolution();
            }
        }
    }

    this.mouseOut = function(){
        if (location!=null && location.isHighlighted()){
            location.setNormal().setNormal();
        }
    }


    this.createBoardInDocument = function(){
        var table = document.getElementById('board');
        while (table.rows.length>0){
            table.deleteRow(0);
        }
        for (var i in locations){
            var row = table.insertRow(i);
            var content = locations[i];
            for (var j=0;j<content.length;j++){
                var cell = row.insertCell(j);
                var location = content[j];
                cell.innerHTML=location.getNumber();
                cell.setAttribute('id',location.getId());
                cell.className=location.getClass();
                cell.onmouseover=function(event){
                    board.mouseIn(event? event : window.event);
                };
                cell.onmouseout=board.mouseOut;
                cell.onclick=board.mouseClick;
            }
        }
    }


    this.createPiecesInDocument = function(){
        var table = document.getElementById('pieces');
        while (table.rows.length>0){
            table.deleteRow(0);
        }
        var line = 0;
        var iline = 0;
        var row;
        for (var i in this.pieces){
            if (iline>=line){
                row = table.insertRow(line++);
                iline=0;
            }
            var cell = row.insertCell(iline++);
            var piece = this.pieces[i];
            cell.innerHTML=piece.toString();
            cell.setAttribute('id', piece.getId());
            cell.className=piece.getClass();
        }
    }

    this.checkSolution = function(){
        for (var p in this.pieces){
            if (!pieces[p].isOk()){
                return;
            }
        }
        this.setSolved();

        // Solved
        // Go to the next page
        $("body").fadeOut(3000, function() {
            window.location = "mccarty.htm";
        });

    };


    this.setSolved=function(){
        for (var r in this.locations){
            var row = this.locations[r];
            for (var c in row){
                row[c].setSolved();
            }
        }
    }

    this.clear=function(){
        for (var p in this.pieces){
            pieces[p].clear();
        }
        for (var r in this.locations){
            var row = this.locations[r];
            for (var c in row){
                row[c].clear();
            }
        }
    }

    this.showSolution=function(){
        this.clear();
        for (var s in this.solution){
            var sol = solution[s];
            var a = this.locations[sol[0]][sol[1]];
            var direction;
            var b;
            if (sol[2]){
                direction=LinkDirection.RIGHT;
                b=this.locations[sol[0]][sol[1]+1];
            } else {
                direction=LinkDirection.DOWN;
                b=this.locations[sol[0]+1][sol[1]];
            }
            a.setHighlighted(direction, b);
            a.setLinked(true);
        }
        this.setSolved();
    }

    function shuffle(pieces){
        var limit = pieces.length;
        pieces=pieces.slice(0);
        function getPiece(n){
            while (n < limit){
                var ret = pieces[n];
                if (ret!=null){
                    pieces[n]=null;
                    return ret;
                }
                ++n;
            }
            return getPiece(0);
        }
        var ret = new Array();
        var index = 0;
        while (index < limit){
            ret[index++] = getPiece(Math.floor(Math.random()*limit));
        }
        return ret;
    }

    function locatePiece(pieces, i, h, v){
        if (i<0) return true;

        while (h>tPlus1 || locations[v][h]!=null){
            h+=1;
            if (h>tPlus1){
                h=0;
                v+=1;
            }
        }

        var firstDirection = Math.random()<.5? 0 : 1;
        var direction=firstDirection;
        for (var each = 0; each<2; each++){
            if (direction) {

                if (h<tPlus1 && locations[v][h+1]==null){
                    locations[v][h+1]=new Cell(
                        firstDirection? pieces[i].a : pieces[i].b, v, h+1);
                    if (locatePiece(pieces, i-1, h+2, v)){
                        locations[v][h]=new Cell(
                            firstDirection? pieces[i].b:pieces[i].a, v, h);
                        solution.push(new Array(v, h, true));
                        return true;
                    }
                    locations[v][h+1]=null;
                }
            } else if (v<t){

                locations[v+1][h]=new Cell(
                    firstDirection? pieces[i].a : pieces[i].b, v+1, h);
                if (locatePiece(pieces, i-1, h+1, v)){
                    locations[v][h]=new Cell(
                        firstDirection? pieces[i].b : pieces[i].a, v, h);
                    solution.push(new Array(v, h, false));
                    return true;
                }
                locations[v+1][h]=null;
            }
            direction=1-direction;
        }
        return false;
    }

    var tPlus1 = t+1
    var locations = new Array();
    this.pieces = new Array();
    for (n=0; n<=t;n++){
        locations[n] = new Array();
        for (m=0; m<=n; m++){
            this.pieces.push(new Domino(n, m));
        }
    }
    this.locations=locations;
    var solution = this.solution= new Array();
    {
        var pieces = shuffle(this.pieces);
        if (!locatePiece(pieces, pieces.length-1, 0, 0)){
            throw 'Error creating locations';
        }
    }
    return this;
}

function recreateBoard()
{
    board = Board(2);
    board.createBoardInDocument();
    board.createPiecesInDocument();
}

recreateBoard();
