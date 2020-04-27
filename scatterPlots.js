var dur = 1000
var margins = {top:15,bottom:40,left:70,right:15};
var graph =
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
var screen = {width:500, height:400};
    
    //how much space will be on each side of the graph

var newScale = function(students, lengths)
{

var xScale = d3.scaleLinear()
        .domain([getMeanGrade(students)])
        .range([0, graph.width])
           
    var yScale = d3.scaleLinear()
        .domain([0, getMeanGrade(students)])
        .range([graph.height,0])
    
    return {xScale:xScale,yScale:yScale}
}

var updateGraph = function(target,students,lengths)
{
    
    students.sort(function(e1,e2)
                 {return e2.grade-e1.grade})
    
    console.log("updating graph")
    
    var scales = newScale(students,lengths)
    var xScale = scales.xScale;
    var yScale = scales.yScale;
    
    //updateTitleBanner(msg)
    updateAxes(target,xScale,yScale)
    
    var circles = d3.select(target)
        .select(".graph")
        .selectAll("circle")
        .data(students, getMeanGrade(students))
        
    
    circles.enter()
        .append("circle")
    
    circles.exit()
        .remove()
    
    d3.select(target)
        .select(".graph")
        .selectAll("circle")
        .transition()
        .duration(dur)
        .attr("x", function(student)
                {return xScale(students.grade)})
        .attr("y",function(students)
                {return yScale(students.grade)})
        .attr("width",xScale.bandwidth)
        .attr("height",function(student)
                {return lengths.graph.height-yScale(student.grade)})
        .attr("cx",2)
        .attr("cy",2)
        .attr("fill","green")
}

var createLabels = function(lengths,target)
    {
        var labels = d3.select(target)
            .append("g")
            .classed("labels",true)
        
        labels.append("text")
            .attr("transform","translate(20,"+(lengths.margins.top+(lengths.graph.height/2))+")")
            .append("text")
            .text("Grade")
            .classed("label",true)
            .attr("text-anchor","middle")
            .attr("transform","rotate(90)")
    }
var initAxes = function(lengths,target,xScale,yScale)
{
    var axes = d3.select(target)
        .append("g")
        .classed("class","axis")
    
    axes.append("g")
        .attr("id","xAxis")
        .attr("transform","translate("+lengths.margins.left+","+(lengths.margins.top+lengths.graph.height)+")")
        
    
    axes.append("g")
        .attr("id","yAxis")
        .attr("transform","translate("+(lengths.margins.left-5)+","+(lengths.margins.top)+")")
}

var updateAxes = function(target,xScale,yScale)
{
    var xAxis = d3.axisBottom(xScale)
    var yAxis = d3.axisLeft(yScale)
    
    d3.select("#xAxis")
        .transition()
        .duration(dur)
        .call(xAxis)
    
    d3.select("#yAxis")
        .transition()
        .duration(dur)
        .call(yAxis)
    
}



//gets the grade for each type requested
var getMeanGrade = function(entries)
{
    return d3.mean(entries,function(entry)
        {
            return entry.grade;
        })
}

//draws the scatterplot
var drawScatter = function(students,target,
              xScale,yScale,xProp,yProp)
{
     //sets the title to whatever the button you click on does
    setBanner(xProp.toUpperCase() +" vs "+ yProp.toUpperCase());
    
    d3.select(target).select(".graph")
    .selectAll("circle")
    .data(students)
    .enter()
    .append("circle")
    .attr("cx",function(student)
    {
        return xScale(getMeanGrade(student[xProp]));    
    })
    .attr("cy",function(student)
    {
        return yScale(getMeanGrade(student[yProp]));    
    })
    .attr("r",4);
}

var clearScatter = function(target)
{
    d3.select(target)
        .select(".graph")
        .selectAll("circle")
        .remove();
}

//axes drawing
var createAxes = function(screen,margins,graph,
                           target,xScale,yScale)
{
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    var axes = d3.select(target)
        .append("g")
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top+graph.height)+")")
        .call(xAxis)
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top)+")")
        .call(yAxis)
}


var initGraph = function(target,students)
{
    //the size of the screen
    
    
    //generated how much space the graph will take up
    var graph = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }

var lengths = 
    {
        screen:screen,
        margins:margins,
        graph:graph
    }
    //set the screen size
    d3.select(target)
        .attr("width",screen.width)
        .attr("height",screen.height)
    
    //create a group for the graph
    var g = d3.select(target)
        .append("g")
        .classed("graph",true)
        .attr("transform","translate("+margins.left+","+
             margins.top+")");
        
    //create scales for all of the dimensions
    
    
    createLabels(lengths,target)
    initAxes(lengths,target)
    updateGraph(target,students,lengths)
    
    createAxes(screen,margins,graph,target,xScale,yScale);
    
    initButtons(students,target,xScale,yScale);
    
    setBanner("Click buttons to graphs");
    
    

}

var initButtons = function(students,target,xScale,yScale)
{
    
    d3.select("#fvh")
    .on("click",function()
    {
        clearScatter(target);
        drawScatter(students,target,
              xScale,yScale,"final","homework");
    })
    
    d3.select("#hvq")
    .on("click",function()
    {
        clearScatter(target);
        drawScatter(students,target,
              xScale,yScale,"homework","test");
    })
    
    d3.select("#tvf")
    .on("click",function()
    {
        clearScatter(target);
        drawScatter(students,target,
              xScale,yScale,"test","final");
    })
    
    d3.select("#tvq")
    .on("click",function()
    {
        clearScatter(target);
        drawScatter(students,target,
              xScale,yScale,"test","quizes");
    })
    
    
    
}

var setBanner = function(msg)
{
    d3.select("#banner")
        .text(msg);
    
}



var penguinPromise = d3.json("/classData.json");

penguinPromise.then(function(penguins)
{
    console.log("class data",penguins);
   initGraph("#scatter",penguins);
   
},
function(err)
{
   console.log("Error Loading data:",err);
});