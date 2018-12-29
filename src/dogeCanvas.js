const TinyColor = require('tinycolor2')

var fontName = 'Comic Sans MS, doge, Marker Felt, Sans';
var palette = ['fuchsia', 'orange', 'yellow', 'turquoise', 'maroon', 'blue', 'red', 'lime', 'crimson', 'indigo']

console.log("Colors available", palette)

module.exports = function(options){
    var canvas = options.canvas,
        ctx = canvas.getContext('2d'),
        font = options.font,
        fontSize = options.fontSize || 45,
        dogeImgURL = options.imgURL,
        img = new options.imageClass(),
        imageWidth,
        imageHeight,
        colorsUsed = [],
        lineSectionHeight; // height available to a single line

    function initCanvas() {
        let posX = 0

        // Flip image
        ctx.save()
        if (Math.random() >= 0.5) {
            ctx.scale(-1, 1)
            posX = -img.width
        }

        ctx.drawImage(img, posX, 0, img.width, img.height); //clears the canvas
        ctx.restore()

        ctx.font =  fontSize + 'px ' + fontName;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
    }

    if (font) {
        fontName = font.name;
        ctx.addFont(font);
    }

    img.onload = function(){
        imageWidth = canvas.width = img.width;
        imageHeight = canvas.height = img.height;

        initCanvas();

        if (options.callback) {
            options.callback();
        }
    };

    img.src = dogeImgURL;

    function addLineToCanvas (text, lineIndex){
        const textWidth = ctx.measureText(text).width
        const xMax = imageWidth - textWidth
        const yMin = lineIndex * lineSectionHeight
        const xPos = Math.random() * xMax
        const yPos = yMin + Math.random() * (lineSectionHeight - fontSize)
        const fillStyle = getRandomColor()
        const strokeStyle = TinyColor(fillStyle)
            .complement()
            .darken()
            .toHexString()

        ctx.strokeStyle = strokeStyle
        ctx.lineWidth = 4;
        ctx.miterLimit = 2;
        ctx.strokeText(text, xPos, yPos);
        ctx.fillStyle = fillStyle
        ctx.fillText(text, xPos, yPos);
            
        return {
            fillStyle: fillStyle,
            text: text,
            xPos: xPos,
            yPos: yPos
        }
    }
    function getRandomColor() {
        var color, index

        do {
            index = Math.floor(( Math.random() * 1000 ) % palette.length);
        } while (colorsUsed.indexOf(index) !== -1)

        colorsUsed.push(index)

        return palette[index]
    }

    return {
        addLines: function(lines){
            initCanvas();
            colorsUsed = [];
            // Divide the image into vertical 'sections' so lines don't overlap
            lineSectionHeight = imageHeight / lines.length;
            var x = lines.map(addLineToCanvas);
            
            return x;
        },

        fillCanvasFromData: function(dataArray){
            initCanvas();

            dataArray.forEach(function(data){
                ctx.fillStyle = data.fillStyle;
                ctx.fillText(data.text, parseFloat(data.xPos, 10), parseFloat(data.yPos, 10));
            });
        }
    };
};
