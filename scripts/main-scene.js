var MainScene = pc.createScript('Main-Scene-Script');

var cardShaderDef;
var templateCard, scrollParent;
var uTime = 0.0, handleTouch, currentSmoothScroll = 0.0, targetSmoothScroll = 0.0;

var LMBHeld = false;

const timeUpdateEntities = [];

MainScene.prototype.initialize = function() {
    
    handleTouch = (typeof window !== 'undefined') && ('ontouchstart' in window || ('maxTouchPoints' in navigator && navigator.maxTouchPoints > 0));
    if(handleTouch){
        this.app.touch.on(pc.EVENT_TOUCHSTART, this.onInputDown, this);
        this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onInputMove, this);
        this.app.touch.on(pc.EVENT_TOUCHEND, this.onInputUp, this);
    }else{
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onInputDown, this);
        this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onInputMove, this);
        this.app.mouse.on(pc.EVENT_MOUSEUP, this.onInputUp, this);
        this.app.mouse.on(pc.EVENT_MOUSEWHEEL, this.onMouseScroll, this);
    }

    cardShaderDef = {
        attributes: {
            vVertex: pc.SEMANTIC_POSITION,
            vNormal: pc.SEMANTIC_NORMAL,
            vTexCoord: pc.SEMANTIC_TEXCOORD0
        },
        vshader: assets.cardVS.resource,
        fshader: assets.cardFS.resource
    };
    
    // app.on('update', dt => bolt.rotate(10 * dt, 20 * dt, 10 * dt));

    templateCard = new pc.Entity('Card');
    templateCard.addComponent('render',{
        type: 'plane'
    });

    scrollParent = new pc.Entity('Scroll-Parent-Card');
    app.root.addChild(scrollParent);

    // Create some text content
    const text = new pc.Entity("Text");
    text.addComponent("element", {
        alignment: new pc.Vec2(0, 0),
        anchor: new pc.Vec4(0, 1, 0, 1),
        autoHeight: true,
        autoWidth: false,
        fontSize: 32,
        lineHeight: 36,
        pivot: new pc.Vec2(0, 1),
        text: "This is a scroll view control. You can scroll the content by dragging the vertical " +
                "or horizontal scroll bars, by dragging the content itself, by using the mouse wheel, or " +
                "by using a trackpad. Notice the elastic bounce if you drag the content beyond the " +
                "limits of the scroll view.",
        type: pc.ELEMENTTYPE_TEXT,
        width: 600,
        wrapLines: true
    });

    // Group to hold the content inside the scroll view's viewport
    content = new pc.Entity('Content');
    content.addChild(text);

    content.addComponent('element', {
        anchor: new pc.Vec4(0, 1, 0, 1),
        height: 3400,
        pivot: new pc.Vec2(0, 1),
        type: pc.ELEMENTTYPE_GROUP,
        useInput: true,
        width: 600
    });

    // Scroll view viewport
    viewport = new pc.Entity('Viewport');
    viewport.addChild(content);

    viewport.addComponent('element', {
        anchor: new pc.Vec4(0, 0, 1, 1),
        color: new pc.Color(0.2, 0.2, 0.2),
        margin: new pc.Vec4(0, 20, 20, 0),
        mask: true,
        opacity: 1,
        pivot: new pc.Vec2(0, 1),
        rect: new pc.Vec4(0, 0, 1, 1),
        type: pc.ELEMENTTYPE_IMAGE,
        useInput: false
    });

    verticalScrollbar = createScrollbar(false);

    // Create a scroll view
    scrollview = new pc.Entity('ScrollView');
    scrollview.addChild(viewport);
    scrollview.addChild(verticalScrollbar);

    // You must add the scrollview entity to the hierarchy BEFORE adding the scrollview component
    screen.addChild(scrollview);

    // make this fullscreen
    scrollview.addComponent('element', {
        anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
        // anchor: new pc.Vec4(0, 0, 1, 1),
        height: canvas.clientHeight,
        pivot: new pc.Vec2(0.5, 0.5),
        type: pc.ELEMENTTYPE_GROUP,
        useInput: false,
        width: canvas.clientWidth
    });

    scrollview.addComponent('scrollview', {
        bounceAmount: 0.1,
        contentEntity: content,
        friction: 0.05,
        useMouseWheel: false,
        mouseWheelSensitivity: pc.Vec2.ONE,
        horizontal: false,
        scrollMode: pc.SCROLL_MODE_BOUNCE,
        vertical: true,
        verticalScrollbarEntity: verticalScrollbar,
        verticalScrollbarVisibility: pc.SCROLLBAR_VISIBILITY_SHOW_WHEN_REQUIRED,
        viewportEntity: viewport
    });

    this.initCards();

    window.addEventListener('resize', () => this.resizeMethod());
    window.addEventListener('orientationchange', () => this.resizeMethod());
    this.resizeMethod();
};

MainScene.prototype.onInputDown = function(event) {
    let inputPos = {x: handleTouch ? event.touches[0].clientX : event.x, y: handleTouch ? event.touches[0].clientY : event.y};
    if(handleTouch === false){
        if(event.button == 0) LMBHeld = true;
    }
};
MainScene.prototype.onInputMove = function(event) {
    let inputPos = {x: handleTouch ? event.touches[0].clientX : event.x, y: handleTouch ? event.touches[0].clientY : event.y};
};
MainScene.prototype.onInputUp = function(event) {
    let inputPos = {x: handleTouch ? event.changedTouches[0].clientX : event.x, y: handleTouch ? event.changedTouches[0].clientY : event.y};
    
    if(LMBHeld) LMBHeld = false;
};
MainScene.prototype.onMouseScroll = function(event) {
    targetSmoothScroll += event.wheelDelta * 0.051;
    targetSmoothScroll = clamp01(targetSmoothScroll,0,1);
};

MainScene.prototype.initCards = function() {
    for (let i = 0; i < 1; i++) {
        const newCard = templateCard.clone();

        var cardShader = new pc.Shader(device, cardShaderDef);

        newCard.render.meshInstances[0].material = new pc.Material();
        newCard.render.meshInstances[0].material.shader = cardShader;
        newCard.render.meshInstances[0].material.blendType = pc.BLEND_NORMAL;

        scrollParent.addChild(newCard);
        newCard.setLocalEulerAngles(90.0,0.0,0.0);
        newCard.setLocalScale(2,2,2);
        timeUpdateEntities.push(newCard);
    }
};

MainScene.prototype.update = function(dt) {
    uTime += dt * .1;
    if(uTime > 99999) uTime = 0.0;

    // Smooth scrolling
    if(!handleTouch){
        // scrollview.scrollview.enabled = LMBHeld;
        // scrollview.scrollview.enabled = true;
        // console.log(scrollview.scrollview.enabled);

        if(!LMBHeld){
            verticalScrollbar.scrollbar.value = lerp01(verticalScrollbar.scrollbar.value, targetSmoothScroll, dt * 12);
        }else{
            targetSmoothScroll = verticalScrollbar.scrollbar.value;
        }
    }

    camera.setPosition(0,verticalScrollbar.scrollbar.value * -30,10);

    for (let i = 0; i < timeUpdateEntities.length; i++) {
        timeUpdateEntities[i].render.meshInstances[0].material.setParameter('uTime', uTime);
        
    }
};

MainScene.prototype.resizeMethod = function() {
    scrollview.element.width = canvas.clientWidth * window.devicePixelRatio;
    scrollview.element.height = canvas.clientHeight * window.devicePixelRatio;

    content.element.width = canvas.clientWidth * window.devicePixelRatio;
    content.element.height = canvas.clientHeight * window.devicePixelRatio * 4;
};

function createScrollbar(horizontal) {
    const handle = new pc.Entity('Handle');
    const handleOptions = {
        type: pc.ELEMENTTYPE_IMAGE,
        color: new pc.Color(1, 1, 1),
        opacity: 1,
        margin: new pc.Vec4(0, 0, 0, 0),
        rect: new pc.Vec4(0, 0, 1, 1),
        mask: false,
        useInput: true
    };
    if (horizontal) {
        handleOptions.anchor = new pc.Vec4(0, 0, 0, 1);  // Split in Y
        handleOptions.pivot = new pc.Vec2(0, 0);         // Bottom left
    } else {
        handleOptions.anchor = new pc.Vec4(0, 1, 1, 1);  // Split in X
        handleOptions.pivot = new pc.Vec2(1, 1);         // Top right
    }
    handle.addComponent('element', handleOptions);
    handle.addComponent('button', {
        active: true,
        imageEntity: handle,
        hitPadding: new pc.Vec4(0, 0, 0, 0),
        transitionMode: pc.BUTTON_TRANSITION_MODE_TINT,
        hoverTint: new pc.Color(1, 1, 1),
        pressedTint: new pc.Color(1, 1, 1),
        inactiveTint: new pc.Color(1, 1, 1),
        fadeDuration: 0
    });

    const scrollbar = new pc.Entity(horizontal ? 'HorizontalScrollbar' : 'VerticalScrollbar');

    scrollbar.addChild(handle);

    const scrollbarOptions = {
        type: pc.ELEMENTTYPE_IMAGE,
        color: new pc.Color(0.5, 0.5, 0.5),
        opacity: 1,
        rect: new pc.Vec4(0, 0, 1, 1),
        mask: false,
        useInput: false
    };

    const scrollbarSize = 20;

    if (horizontal) {
        scrollbarOptions.anchor = new pc.Vec4(0, 0, 1, 0);
        scrollbarOptions.pivot = new pc.Vec2(0, 0);
        scrollbarOptions.margin = new pc.Vec4(0, 0, scrollbarSize, -scrollbarSize);
    } else {
        scrollbarOptions.anchor = new pc.Vec4(1, 0, 1, 1);
        scrollbarOptions.pivot = new pc.Vec2(1, 1);
        scrollbarOptions.margin = new pc.Vec4(-scrollbarSize, scrollbarSize, 0, 0);
    }
    scrollbar.addComponent('element', scrollbarOptions);
    scrollbar.addComponent('scrollbar', {
        orientation: horizontal ? pc.ORIENTATION_HORIZONTAL : pc.ORIENTATION_VERTICAL,
        value: 0,
        handleSize: 0.5,
        handleEntity: handle
    });

    return scrollbar;
}

function lerp01(a, b, t) {
	return a + (b - a) * t;
}

function clamp01(number, min, max) {
	return Math.max(min, Math.min(number, max));
}