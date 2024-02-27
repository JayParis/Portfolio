# version 300 es

precision mediump float;


in vec3 vVertex;
in vec3 vNormal;
in vec2 vTexCoord;

out vec3 Position;
out vec3 Normal;
out vec2 TexCoord;

uniform mat4 matrix_model;
uniform mat4 matrix_viewProjection;
uniform mat3 matrix_normal;


void main()
{
  TexCoord = vTexCoord;
  vec4 pt = vec4(vVertex,1.0);

  Normal = normalize(matrix_normal * vNormal);
  Position = vec3(matrix_model * pt);
  gl_Position = matrix_viewProjection * matrix_model  * pt;
}