import { AnyJSExpression, AnyNode, jsLogicalExpression, JSLogicalExpression } from "@internal/ast";
import {createVisitor, Path, signals} from "@internal/compiler";
import {descriptions} from "@internal/diagnostics";

const isFalsy = (node: AnyNode): boolean => {
	return (node.type === 'JSNumericLiteral' && node.value === 0) ||
		(node.type === 'JSStringLiteral' && node.value === '') ||
		(node.type === 'JSBooleanLiteral' && node.value === false) ||
		(node.type === 'JSReferenceIdentifier' && node.name === 'undefined') ||
		(node.type === 'JSReferenceIdentifier' && node.name === 'NaN') ||
		(node.type === 'JSUnaryExpression' && node.operator === '-' &&
			node.argument.type === 'JSNumericLiteral' && node.argument.value === 0) ||
		(node.type === 'JSBigIntLiteral' && node.value === '0') ||
		node.type === 'JSNullLiteral'
}

const booleanSimplifiers = {
	/**
	 * OR identity
	 *
	 * Example: `true || false === true`
	 */
	orFalsy(node: JSLogicalExpression): AnyJSExpression {
		return node.operator === '||' && isFalsy(node.right) ? node.left : node
	}

	// andTrue
}

function recursiveBooleanLogicCheck(node: JSLogicalExpression): AnyJSExpression {
	if (node.left.type === 'JSLogicalExpression') {
		const left = recursiveBooleanLogicCheck(node.left)
		if (left !== node.left) node = jsLogicalExpression.create({ ...node, left })
	}

	if (node.right.type === 'JSLogicalExpression') {
		const right = recursiveBooleanLogicCheck(node.right)
		if (right !== node.right) node = jsLogicalExpression.create({ ...node, right })
	}

	for (let [,simplifier] of Object.entries(booleanSimplifiers)) {
		const newNode = simplifier(node)
		if (newNode !== node) return newNode
	}
	return node
}

export default createVisitor({
	name: "js/simplifyBooleanConditions",
	enter(path) {
		const {node} = path;

		// We can skip sub expressions as we we want to work on the
		// entire logical expression to benefit from multiple simplifications
		if (node.type === 'JSLogicalExpression' && path.parent.type !== 'JSLogicalExpression') {
			const n2 = recursiveBooleanLogicCheck(node)
			if (n2 !== node) {
				return path.addFixableDiagnostic(
					{
						fixed: signals.replace(n2)
					},
					descriptions.LINT.JS_SIMPLIFY_BOOLEAN_CONDITIONS,
				)
			}
		}

		return signals.retain;
	},
});
