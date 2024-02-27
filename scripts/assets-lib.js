const assets = {    
    /*
    bpFont: new pc.Asset("Blender-Pro-Font", "font", {
        url: "./assets/fonts/BlenderPro-Medium.json",
    }),
    charSkinTex: new pc.Asset(
        "Char-Skin-Tex",
        "texture",
        { url: "./assets/textures/T000_Edit_WP.webp" },
        { type: pc.TEXTURETYPE_RGBP, mipmaps: false }
    ),
    */
    mainScene: new pc.Asset("Main-Scene-Script", "script", {
        url: "./scripts/main-scene.js",
    }),

    cardVS: new pc.Asset("Card-Vertex-Shader", "shader", {
        url: "./assets/shaders/card-vertex.glsl",
    }),
    cardFS: new pc.Asset("Card-Fragment-Shader", "shader", {
        url: "./assets/shaders/card-fragment.glsl",
    }),
    bgVS: new pc.Asset("BG-Vertex-Shader", "shader", {
        url: "./assets/shaders/bg-vertex.glsl",
    }),
    bgFS: new pc.Asset("BG-Fragment-Shader", "shader", {
        url: "./assets/shaders/bg-fragment.glsl",
    }),
};