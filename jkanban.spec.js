require('./jkanban');

const initializeDom = () => {
    document.body.innerHTML = '<div id="test"></div>';
}

beforeEach(() => {
    initializeDom();
})

const makeSut = (additionalParams) => {
    let options = {
        element: "#test"
    }
    if (additionalParams !== undefined) {
        for (var prop in additionalParams) {
            options[prop] = additionalParams[prop];
        }
    }

    let jkanban = new jKanban(options);
    return jkanban;
}

describe('jKanban TestCase', () => {
    test('Should init jKanban', async () => {
        const sut = makeSut()

        const expected = document.createElement("div")
        expected.setAttribute("id", "test")
        expected.innerHTML = "<div class=\"kanban-container\"></div>"

        expect(sut.element).toStrictEqual(expected);
    })

    test('Should add a board with no items', async () => {
        const boardName = "test-board"
        const sut = makeSut({
            boards: [
                {
                    "id": boardName
                }
            ]
        })

        expect(sut.findBoard(boardName)).not.toBeUndefined()
        expect(sut.getBoardElements(boardName).length).toEqual(0)
    })



    test('nestedCards initial rendering and addElement to card', () => {
        const sut = makeSut({
            nestedCards: true,
            boards: [
                {
                    id: 'b1',
                    item: [
                        { id: 'card1', title: 'Card 1', children: [{ id: 'card1-1', title: 'Child card' }] }
                    ]
                }
            ]
        })

        const childCard = sut.findElement('card1-1')
        expect(childCard).not.toBeNull()
        expect(childCard.parentNode.closest('[data-eid]').dataset.eid).toBe('card1')

        sut.addElement('card1', { id: 'card1-2', title: 'New child' })
        const added = sut.findElement('card1-2')
        expect(added).not.toBeNull()
        expect(sut.getParentBoardID('card1-2')).toBe('b1')
    })
});