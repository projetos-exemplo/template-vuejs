export const validarCNPJ = cnpj => {
	// Elimina CNPJs invalidos conhecidos
	// Elimina inválidos com todos os caracteres iguais
	if (/^(\d)\1+$/.test(cnpj)) return false;
	// Cáculo de validação
	let t = cnpj.length - 2;
	let d = cnpj.substring(t);
	let d1 = parseInt(d.charAt(0));
	let d2 = parseInt(d.charAt(1));
	let calc = x => {
		let n = cnpj.substring(0, x);
		let y = x - 7;
		let s = 0;
		let r = 0;
		for (let i = x; i >= 1; i--) {
			s += n.charAt(x - i) * y--;
			if (y < 2)
				y = 9
		}

		r = 11 - s % 11
		return r > 9 ? 0 : r
	}

	return calc(t) === d1 && calc(t + 1) === d2
}