const DECISION_THRESHOLD = 75
let isAnimating = false
let pullDeltaX = 0 //distancia que la card del html se mueve

function startDrag(event) {
	if (isAnimating) return

	// get the first article element
	const actualCard = event.target.closest('article')
	if (!actualCard) return

	// get initial position of mouse or finger
	const startX = event.pageX ?? event.touches[0].pageX

	// listen the mouse and touch movements
	document.addEventListener('mousemove', onMove)
	document.addEventListener('mouseup', onEnd)

	document.addEventListener('touchmove', onMove, { passive: true })
	document.addEventListener('touchend', onEnd, { passive: true })

	function onMove(event) {
		// posicion actual
		const currentX = event.pageX ?? event.touches[0].pageX
		// distancia entre posicion inicial y la actual
		pullDeltaX = currentX - startX

		if (pullDeltaX === 0) return

		isAnimating = true

		// grados que se quiere rotar
		const deg = pullDeltaX / 14

		actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`
		actualCard.style.cursor = 'grabbing'

		// cambiar opacidad de la informacion de la eleccion
		const opacity = Math.abs(pullDeltaX) / 100
		const isRight = pullDeltaX > 0
		const choiceEl = isRight
			? actualCard.querySelector('.choice.like')
			: actualCard.querySelector('.choice.nope')

		choiceEl.style.opacity = opacity
	}

	function onEnd(event) {
		document.removeEventListener('mousemove', onMove)
		document.removeEventListener('mouseup', onEnd)
		document.removeEventListener('touchmove', onMove)
		document.removeEventListener('touchend', onEnd)

		// saber si el usuario tomo una decision
		const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD

		if (decisionMade) {
			const goRight = pullDeltaX >= 0
			const goLeft = !goRight
			actualCard.classList.add(goRight ? 'go-right' : 'go-left')
			actualCard.addEventListener('transitionend', () => {
				actualCard.remove()
			})
		} else {
			actualCard.classList.add('reset')
			actualCard.classList.remove('go-right', 'go-left')
		}

		actualCard.addEventListener('transitionend', () => {
			actualCard.removeAttribute('style')
			actualCard.classList.remove('reset')

			pullDeltaX = 0
			isAnimating = false
		})
	}
}

document.addEventListener('mousedown', startDrag)
document.addEventListener('touchstart', startDrag, { passive: true })
