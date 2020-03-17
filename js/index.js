
text = document.getElementById("txet")
result = document.getElementById("reslut")

text.addEventListener("input", function() {
	result.value = kopkeify(text.value)
})

var vowel = ['a', 'â', 'e', 'ê', 'ı', 'î', 'i', 'o', 'ô', 'ö', 'u', 'û', 'ü']
var slices = [
	['001000', 5],
	['000100', 5],
	['01000', 4],
	['00100', 4],
	['00010', 4],
	['1000', 3],
	['0100', 3],
	['0011', 3],
	['0010', 3],
	['011', 2],
	['010', 2],
	['100', 2],
	['10', 1],
	['11', 1]]

var kopkes = [
	['010', [0, 2, 1]],
	['1010', [0, 2, 1, 3]],
	['0101', [0, 2, 1, 3]],
	['0100', [0, 2, 1, 3]]
]

function kopkeHyphen(current, next, currentOneZero, nextOneZero) {
	var result = ''
	for (var i = 0; i < kopkes.length; i++) {
		if (currentOneZero === kopkes[i][0] || currentOneZero + nextOneZero === kopkes[i][0]) {
			for (var j = 0; j < kopkes[i][1].length; j++) {
				result = result + (current + next).charAt(kopkes[i][1][j])
			}
			return {
				usedSecond: result.length > current.length,
				result: result
			}
		}
	}
	return {
		usedSecond: false,
		result: current
	}
}

function kopke(hyphensResult) {
	var j = 0
	var result = ''
	for (; j < hyphensResult.hyphens.length - 1; j++) {
		var kopkeResult = kopkeHyphen(
			hyphensResult.hyphens[j],
			hyphensResult.hyphens[j + 1],
			hyphensResult.oneZeroHyphens[j],
			hyphensResult.oneZeroHyphens[j + 1])
		if (kopkeResult.usedSecond) {
			j++
		}
		result = result + kopkeResult.result
	}
	if (j < hyphensResult.hyphens.length) {
		var kopkeResult = kopkeHyphen(
			hyphensResult.hyphens[j],
			'',
			hyphensResult.oneZeroHyphens[j],
			'')
		result = result + kopkeResult.result
	}
	return result
}

function wordToOneZero(word) {
    var oneZero = ""
    word = word.toLowerCase()
    for (i = 0; i < word.length; i++) {
    	if (vowel.includes(word.charAt(i))) {
    		oneZero = oneZero + "1"
    	} else {
    		oneZero = oneZero + "0"
    	}
    }
    return oneZero
}

function countItems(array, item) {
	return array.split(item).length - 1
}

function hyphenate(word) {
	var oneZero = wordToOneZero(word)
    var hyphens = []
    var oneZeroHyphens = []
    var targetCount = countItems(oneZero , '1')

    for (var i = 0; i < targetCount; i++) {
    	for (var j = 0; j < slices.length; j++) {
    		var slice = slices[j]
    		if (oneZero.startsWith(slice[0])) {
    			hyphens[hyphens.length] = word.substring(0, slice[1])
    			oneZeroHyphens[oneZeroHyphens.length] = oneZero.substring(0, slice[1])
    			word = word.substring(slice[1])
    			oneZero = oneZero.substring(slice[1])
    			break
    		}
    	}
    }

    if (oneZero === "0") {
        hyphens[hyphens.length - 1] = hyphens[hyphens.length - 1] + word
        oneZeroHyphens[oneZeroHyphens.length - 1] = oneZeroHyphens[oneZeroHyphens.length - 1] + oneZero
    }
    else if (word.length > 0) {
        hyphens[hyphens.length] = word
        oneZeroHyphens[oneZeroHyphens.length] = oneZero
    }

    if (hyphens.length != targetCount) {
        return null
    }

    return {
    	hyphens: hyphens,
    	oneZeroHyphens: oneZeroHyphens
    }
}

function kopkeify(str) {
	var words = str.split(' ')
	var converted = []
	for (var i = 0; i < words.length; i++) {
		words[i] = words[i].toLowerCase().replace(/[p]/g, 'b')
		var result = hyphenate(words[i])
		var finalWord = ''
		if (result == null || words[i].length < 3) {
			finalWord = words[i]
		} else {
			finalWord = kopke(result)
		}
		converted[converted.length] = finalWord
	}
	return converted.join(' ')
}
