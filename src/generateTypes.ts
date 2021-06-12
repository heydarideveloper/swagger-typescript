import {
  getJsdoc,
  getRefName,
  getSchemaName,
  getTsType,
  isAscending,
} from "./utils";
import type { Schema, TypeAST } from "./types";

function generateTypes(types: TypeAST[]): string {
  try {
    return types
      .sort(({ name }, { name: _name }) => isAscending(name, _name))
      .reduce((prev, { name: _name, schema, description }) => {
        const name = getSchemaName(_name);
        prev += `
        ${getJsdoc({
          description: {
            ...schema,
            description: description || schema.description,
          },
          tags: {
            deprecated: {
              value: Boolean(schema.deprecated),
              description: schema["x-deprecatedMessage"],
            },
            example: schema.example,
          },
        })}
        ${getTypeDefinition(name, schema)}
        `;

        return prev;
      }, "");
  } catch (error) {
    console.error({ error });
    return "";
  }
}

function getTypeDefinition(name: string, schema: Schema) {
  const {
    type,
    enum: Enum,
    "x-enumNames": enumNames,
    allOf,
    oneOf,
    items,
    $ref,
    additionalProperties,
    properties,
  } = schema;
  if (type === "object") {
    const typeObject = getTsType(schema);

    if (additionalProperties || properties) {
      return `export interface ${name} ${typeObject}`;
    }

    return `export type ${name} = ${typeObject}`;
  }

  if (Enum) {
    return `export enum ${name} {${Enum.map(
      (e, index) =>
        `${enumNames ? enumNames[index] : e}=${
          typeof e === "string" ? `"${e}"` : `${e}`
        }`,
    )}}`;
  }

  if (allOf) {
    return `export type ${name} = ${getTsType({ allOf })}`;
  }
  if (oneOf) {
    return `export type ${name} = ${oneOf
      .map((_schema) => getTsType(_schema))
      .join(" | ")}`;
  }
  if (type === "array" && items) {
    return `export type ${name} = ${getTsType(items)}[]`;
  }

  if ($ref) {
    return `export type ${name} = ${getRefName($ref)}`;
  }

  return `export type ${name} = any`;
}

export { generateTypes };
