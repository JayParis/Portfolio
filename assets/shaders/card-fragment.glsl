# version 300 es

precision mediump float;

in vec3 Position;
in vec3 Normal;
in vec2 TexCoord;

out vec4 fragColor;

uniform float uTime;

const vec2 cardSize = vec2(1.,1.);
const float invertMix = 0.0;
const float ringMaxIterations = 114.0;
const float uvScale = 1.0;

float clamp01(float val){
	return clamp(val, 0.0, 1.0);
}

float qMap(float value, float A, float B){
    return clamp((1.0 / (B - A)) * (value - A), 0.0, 1.0);
}

const float PI = 3.14;
mat2 rotationMatrix(float angle)
{
	angle *= PI / 180.0;
    float sine = sin(angle), cosine = cos(angle);
    return mat2( cosine, -sine, 
                 sine,    cosine );
}

float roundedBoxSDF(vec2 CenterPosition, vec2 Size, float Radius) {
    return length(max(abs(CenterPosition)-Size+Radius,0.0))-Radius;
}

void main() {

    float roundedCorners = roundedBoxSDF(TexCoord - cardSize/2., cardSize/2., .1);
    roundedCorners = smoothstep(roundedCorners, 0.0, 1.0);
    float alpha = clamp01(roundedCorners);

    vec2 translatedPos = vec2(Position.x + uTime,Position.y + uTime) * rotationMatrix(10.0);
	translatedPos *= uvScale;
	vec2 loopedUV = vec2(mod(translatedPos.x, 1.0), mod(translatedPos.y, 1.0)); 

	float pattern = sin( clamp( distance(loopedUV, vec2(.5,.5)) * 85.0, 0.0, ringMaxIterations * PI * 2.0));
	pattern = smoothstep(clamp01(pattern),0.0,0.1);

	if(invertMix > 0.5)
		pattern = 1.-pattern;

	fragColor = vec4(vec3(pattern), alpha);
}