export const sortAngularComponentImports = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    schema: [],
    messages: {
      sortImports: 'Component imports should be sorted alphabetically.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;

    return {
      Property(node) {
        if (
          node.key?.type !== 'Identifier' ||
          node.key.name !== 'imports' ||
          node.value?.type !== 'ArrayExpression'
        ) {
          return;
        }

        const parent = node.parent;
        if (!parent || parent.type !== 'ObjectExpression') {
          return;
        }

        const decorator = parent.parent;
        if (
          !decorator ||
          decorator.type !== 'CallExpression' ||
          decorator.callee.type !== 'Identifier' ||
          decorator.callee.name !== 'Component'
        ) {
          return;
        }

        const elements = node.value.elements.filter(Boolean);

        const names = elements.map((e) => sourceCode.getText(e));

        const sorted = [...names].sort((a, b) => a.localeCompare(b));

        if (names.join('|') === sorted.join('|')) {
          return;
        }

        context.report({
          node: node.value,
          messageId: 'sortImports',
          fix(fixer) {
            return fixer.replaceText(
              node.value,
              `[\n    ${sorted.join(',\n    ')},\n  ]`
            );
          },
        });
      },
    };
  },
};
