import React from "react";
import ReactDOM from "react-dom";
import * as math from 'mathjs'
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { TextField, Button, ButtonGroup } from'@material-ui/core';

class Graphic extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        scaleSize: "",
        rotationDegreeX: "",
        rotationDegreeY: "",
        rotationDegreeZ: "", 
        projection: "",
        paths: [],
        vertexMatrix: [],
        context: null
      }
    //   this.draw = this.draw.bind(this)
    this.onChangeHandler = this.onChangeHandler.bind(this)
    this.parseContent = this.parseContent.bind(this)
    this.scale = this.scale.bind(this)
    this.rotateX = this.rotateX.bind(this)
    this.rotateY = this.rotateY.bind(this)
    this.rotateZ = this.rotateZ.bind(this)
    this.preDraw = this.preDraw.bind(this)
    this.drawLine = this.drawLine.bind(this)
    this.draw = this.draw.bind(this)
    this.drawOblique = this.drawOblique.bind(this)
  }

    onChangeHandler(event){
        const file = event.target.files[0];
        const textType = /text.*/;
           if (file.type.match(textType)) {
               const reader = new FileReader();
               reader.onload = (e) => {
                   let content = reader.result;
                   //Here the content has been read successfuly
                   this.parseContent(content);
               }
               reader.readAsText(file);    
           } 
       }

    parseContent(content){
        let vertexStr = content.split("paths\n")[0].split("vertex\n")[1]
        let vertex = []
        let vertexLines = vertexStr.split('\n')
        vertexLines.map(v =>{
            if(v){
                let currV = []
                v.split(",").map(item =>{
                    currV.push(parseInt(item))
                })
                vertex.push(currV)
            }
        })
        let pathStr = content.split("paths\n")[1]
        let paths = []
        let pathLines = pathStr.split('\n')
        pathLines.map(p =>{
            if(p){
                let currP = []
                p.split(",").map(item =>{
                    currP.push(parseInt(item))
                })
                paths.push(currP)
            }
        })
        let vertexMatrix = vertex.map(point => 
            math.matrix([
              [point[0], 0, 0, 0],
              [0, point[1], 0, 0],
              [0, 0, point[2], 0],
              [0, 0, 0, 350]
            ])
          )
        this.setState({ paths: paths, vertexMatrix: vertexMatrix })
        this.preDraw()
    }

    preDraw(){
        const canvas = this.refs.canvas
        const context = canvas.getContext("2d")
        context.transform(1, 0, 0, -1, 0, canvas.height)
        this.draw(context)
        this.setState({context:context})
    }

    drawOblique(context){
        console.log("drawOblique")
        const sin = math.sin(math.unit(45, 'deg'))
        const cos = math.cos(math.unit(45, 'deg'))
        let drawObliqueMatrix = []
        this.state.vertexMatrix.map(point => {
            point.subset(math.index(2, 0), point.subset(math.index(2, 0))*cos*0.5)
            point.subset(math.index(2, 1), point.subset(math.index(2, 1))*sin*0.5)
            drawObliqueMatrix.push(point)
            })
            console.log(drawObliqueMatrix)
        this.state.context.clearRect(0, 0, this.refs.canvas.width,  this.refs.canvas.height);
        this.state.context.beginPath() 
        // NEED TO FINISH    
        this.state.paths.map(path => {
            for(let i=0; i<path.length-1; i++){
                
            this.drawLine(this.state.context,drawObliqueMatrix[path[i]-1],drawObliqueMatrix[path[i+1]-1])
            }
            })
    }
    draw(context){
        this.state.paths.map(path => {
            for(let i=0; i<path.length-1; i++){
            this.drawLine(context,this.state.vertexMatrix[path[i]-1],this.state.vertexMatrix[path[i+1]-1])
            }
            })
        }

    drawLine(ctx, p1, p2){
        console.log("innn")
        ctx.moveTo(p1.subset(math.index(0, 0))+p1.subset(math.index(3, 3)) , p1.subset(math.index(1, 1))+p1.subset(math.index(3, 3)));
        ctx.lineTo(p2.subset(math.index(0, 0))+p2.subset(math.index(3, 3)) , p2.subset(math.index(1, 1))+p2.subset(math.index(3, 3)));
        ctx.stroke();
        
    }


    scale(size){
        let scaled = []
        this.state.vertexMatrix.map(point => {
             if(point){
                point.subset(math.index(0, 0), point.subset(math.index(0, 0))*size)
                point.subset(math.index(1, 1), point.subset(math.index(1, 1))*size)
                point.subset(math.index(2, 2), point.subset(math.index(2, 2))*size)
            }
            scaled.push(point)
        })
        this.setState({vertexMatrix: scaled})
        this.state.context.clearRect(0, 0, this.refs.canvas.width,  this.refs.canvas.height);
        this.state.context.beginPath()
        this.draw(this.state.context)
        }

    rotateX(angle){
        const sin = math.sin(math.unit(angle, 'deg'))
        const cos = math.cos(math.unit(angle, 'deg'))
        let rotated = []
        this.state.vertexMatrix.map(point => {
            point.subset(math.index(1, 1), point.subset(math.index(1, 1))*cos)
            point.subset(math.index(1, 2), point.subset(math.index(1, 2))*sin)
            point.subset(math.index(2, 1), point.subset(math.index(2, 1))*sin*(-1))
            point.subset(math.index(2, 2), point.subset(math.index(2, 2))*cos)
            rotated.push(point)
          })
          this.setState({vertexMatrix: rotated})
          this.state.context.clearRect(0, 0, this.refs.canvas.height,  this.refs.canvas.height);
          this.state.context.beginPath()
          this.draw(this.state.context)
          }
      
    rotateY(angle){
        const sin = math.sin(math.unit(angle, 'deg'))
        const cos = math.cos(math.unit(angle, 'deg'))
        let rotated = []
        this.state.vertexMatrix.map(point => {
            point.subset(math.index(0, 0), point.subset(math.index(0, 0))*cos)
            point.subset(math.index(0, 2), point.subset(math.index(0, 2))*sin*(-1))
            point.subset(math.index(2, 0), point.subset(math.index(2, 0))*sin)
            point.subset(math.index(2, 2), point.subset(math.index(2, 2))*cos)
            rotated.push(point)
          })
          this.setState({vertexMatrix: rotated})
          this.state.context.clearRect(0, 0, this.refs.canvas.height,  this.refs.canvas.height);
          this.state.context.beginPath()
          this.draw(this.state.context)
          }
      
    rotateZ(angle){
        const sin = math.sin(math.unit(angle, 'deg'))
        const cos = math.cos(math.unit(angle, 'deg'))
        let rotated = []
        this.state.vertexMatrix.map(point => {
            point.subset(math.index(0, 0), point.subset(math.index(0, 0))*cos)
            point.subset(math.index(0, 1), point.subset(math.index(0, 1))*sin)
            point.subset(math.index(1, 0), point.subset(math.index(1, 0))*sin*(-1))
            point.subset(math.index(1, 1), point.subset(math.index(1, 1))*cos)
            rotated.push(point)
          })
          this.setState({vertexMatrix: rotated})
          this.state.context.clearRect(0, 0, this.refs.canvas.height, this.refs.canvas.height);
          this.state.context.beginPath()
          this.draw(this.state.context)
          }

    

    checkScaleInput = input => {
        if(isNaN(input) || input.length===0)
            alert("please enter a number")
        else
            this.scale(input)
        }

    checkRotationInputX = input => {
        if(isNaN(input) || input.length===0)
            alert("please enter a number")
        else
            this.rotateX(input)   
        }

    checkRotationInputY = input => {
        if(isNaN(input) || input.length===0)
            alert("please enter a number")
        else
            this.rotateY(input)   
        }

    checkRotationInputZ = input => {
        if(isNaN(input) || input.length===0)
            alert("please enter a number")
        else
            this.rotateZ(input)   
        }      
          
//  useStyles(){ makeStyles((theme) => ({
//     root: {
//       flexGrow: 1,
//     },
//     paper: {
//       padding: theme.spacing(2),
//       textAlign: 'center',
//       color: theme.palette.text.secondary,
//     },
//   }))}
  

  render() {
        return(
            <div>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                {/* <Paper> */}
                <form noValidate autoComplete="off"> 
                <input type="file" name="file" onChange={this.onChangeHandler}/>
                <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                  <Button onClick={()=> this.setState({projection:"orthographic"})}>Parallel orthographic</Button>
                  <Button onClick={()=> {this.drawOblique(this.state.context)}}>Parallel oblique</Button>
                  <Button onClick={()=> this.setState({projection:"perspective"})}>Perspective</Button>
                </ButtonGroup>
                <h3>Scaling</h3>
                  <TextField id="manualScale" label="scaling size"
                  value={this.state.scaleSize}
                  onChange={e => this.setState({scaleSize: e.target.value})}/> 
                  <Button color="primary" variant="outlined" style={{"marginLeft":"10px"}} onClick={()=>this.checkScaleInput(this.state.scaleSize)}>Scale</Button>
                  <br/>
                  <ZoomInIcon color="action" onClick={()=> this.scale(1.1)}/>
                  <ZoomOutIcon color="action" onClick={()=> this.scale(0.9)}/>
                  <h3>Rotation</h3>
                  <TextField id="manualScale" label="rotation X degree"
                  value={this.state.rotationDegreeX} 
                  onChange={e => this.setState({rotationDegreeX: e.target.value})}/> 
                  <Button color="primary" variant="outlined" style={{"marginLeft":"10px"}} onClick={()=>this.checkRotationInputX(this.state.rotationDegreeX)}>Rotate</Button>
                  <br/>
                  <TextField id="manualScale" label="rotation Y degree"
                  value={this.state.rotationDegreeY}
                  onChange={e => this.setState({rotationDegreeY: e.target.value})}/> 
                  <Button color="primary" variant="outlined" style={{"marginLeft":"10px"}} onClick={()=>this.checkRotationInputY(this.state.rotationDegreeY)}>Rotate</Button>
                  <br/>
                  <TextField id="manualScale" label="rotation Z degree"
                  value={this.state.rotationDegreeZ}
                  onChange={e => this.setState({rotationDegreeZ: e.target.value})}/> 
                 <Button color="primary" variant="outlined" style={{"marginLeft":"10px"}} onClick={()=>this.checkRotationInputZ(this.state.rotationDegreeZ)}>Rotate</Button>
                </form>
                {/* </Paper> */}
              </Grid>
              <Grid item xs={8}>
                {/* <Paper className={this.state.classes.paper}>Canvas */}
                  <canvas
                    //   id="myCanvas"
                      width="700"
                      height="700"
                      ref="canvas"
                    >
                    </canvas> 
                {/* </Paper> */}
              </Grid>
            </Grid>
          </div>
        )}
   
  }
export default Graphic
