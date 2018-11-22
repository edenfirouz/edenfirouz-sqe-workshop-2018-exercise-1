import assert from 'assert';
import {parseCode, createTable} from '../src/js/code-analyzer';


describe('The javascript parser to table',() => {
    it('is parsing to table an empty function correctly', () => {
        assert.equal(
            createTable(parseCode('')),
            '<table border="1"><tr><td> Line </td><td> Type </td><td> Name </td><td> Condition </td><td> Value </td></tr></table>'
        );
    });
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            createTable(parseCode('let a = 1;')),
            '<table border="1"><tr><td> Line </td><td> Type </td><td> Name </td><td> Condition </td><td> Value </td></tr><tr><td>1</td><td>Variable Declaration</td><td>a</td><td></td><td>1</td></tr></table>'
        );
    });
    it('is parsing a complex member expression correctly', () => {
        assert.equal(
            createTable(parseCode('a[0] = 1+x;')),
            '<table border="1"><tr><td> Line </td><td> Type </td><td> Name </td><td> Condition </td><td> Value </td></tr><tr><td>1</td><td>Assignment Expression</td><td>a[0]</td><td></td><td>1+x</td></tr></table>'
        );
    });
    it('is parsing a complex variable declaration and return statement correctly', () => {
        assert.equal(
            createTable(parseCode('function binarySearch(X, V, n){\n' +
                '    let low, high, mid;\n' +
                '    low = 0;\n' +
                '    high = n - 1;\n' +
                '    while (low <= high) {\n' +
                '        mid = (low + high)/2;\n' +
                '        if (X < V[mid])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[mid])\n' +
                '            low = mid + 1;\n' +
                '        else\n' +
                '            return mid;\n' +
                '    }\n' +
                '    return -1;\n' +
                '}')),
            '<table border="1"><tr><td> Line </td><td> Type </td><td> Name </td><td> Condition </td><td> Value </td></tr><tr><td>1</td><td>Function Declaration</td><td>binarySearch</td><td></td><td></td></tr><tr><td>1</td><td>Variable Declaration</td><td>X</td><td></td><td></td></tr><tr><td>1</td><td>Variable Declaration</td><td>V</td><td></td><td></td></tr><tr><td>1</td><td>Variable Declaration</td><td>n</td><td></td><td></td></tr><tr><td>2</td><td>Variable Declaration</td><td>low</td><td></td><td></td></tr><tr><td>2</td><td>Variable Declaration</td><td>high</td><td></td><td></td></tr><tr><td>2</td><td>Variable Declaration</td><td>mid</td><td></td><td></td></tr><tr><td>3</td><td>Assignment Expression</td><td>low</td><td></td><td>0</td></tr><tr><td>4</td><td>Assignment Expression</td><td>high</td><td></td><td>n-1</td></tr><tr><td>5</td><td>While Statement</td><td></td><td>low&lt=high</td><td></td></tr><tr><td>6</td><td>Assignment Expression</td><td>mid</td><td></td><td>(low+high)/2</td></tr><tr><td>7</td><td>If Statement</td><td></td><td>X&ltV[mid]</td><td></td></tr><tr><td>8</td><td>Assignment Expression</td><td>high</td><td></td><td>mid-1</td></tr><tr><td>9</td><td>If Statement</td><td></td><td>X>V[mid]</td><td></td></tr><tr><td>10</td><td>Assignment Expression</td><td>low</td><td></td><td>mid+1</td></tr><tr><td>11</td><td>Else Statement</td><td></td><td></td><td></td></tr><tr><td>12</td><td>Return Statement</td><td></td><td></td><td>mid</td></tr><tr><td>13</td><td>Return Statement</td><td></td><td></td><td>-1</td></tr></table>'
        );
    });
    it('is parsing a complex function correctly', () => {
        assert.equal(
            createTable(parseCode('function func1(){\n' +
                '\tlet a=-1;\n' +
                '\tlet b=a+2;\n' +
                '\tlet c=a+b;\n' +
                '\treturn (a+b)/c;\n' +
                '}')),
            '<table border="1"><tr><td> Line </td><td> Type </td><td> Name </td><td> Condition </td><td> Value </td></tr><tr><td>1</td><td>Function Declaration</td><td>func1</td><td></td><td></td></tr><tr><td>2</td><td>Variable Declaration</td><td>a</td><td></td><td>-1</td></tr><tr><td>3</td><td>Variable Declaration</td><td>b</td><td></td><td>a+2</td></tr><tr><td>4</td><td>Variable Declaration</td><td>c</td><td></td><td>a+b</td></tr><tr><td>5</td><td>Return Statement</td><td></td><td></td><td>(a+b)/c</td></tr></table>'
        );
    });
    it('is parsing a for statement correctly', () => {
        assert.equal(
            createTable(parseCode('function func2(){\n' +
                '\tlet i;\n' +
                '\tlet x=0;\n' +
                '\tfor(i=0 ; i<=10 ; i=i+1){\n' +
                '\t\tx=x+1;\n' +
                '\t}\n' +
                '\treturn x;\n' +
                '}')),
            '<table border="1"><tr><td> Line </td><td> Type </td><td> Name </td><td> Condition </td><td> Value </td></tr><tr><td>1</td><td>Function Declaration</td><td>func2</td><td></td><td></td></tr><tr><td>2</td><td>Variable Declaration</td><td>i</td><td></td><td></td></tr><tr><td>3</td><td>Variable Declaration</td><td>x</td><td></td><td>0</td></tr><tr><td>4</td><td>For Statement</td><td></td><td>i=0 ; i&lt=10 ; i=(i+1)</td><td></td></tr><tr><td>5</td><td>Assignment Expression</td><td>x</td><td></td><td>x+1</td></tr><tr><td>6</td><td>Return Statement</td><td></td><td></td><td>x</td></tr></table>'
        );
});
    it('is parsing a complex member expression correctly', () => {
        assert.equal(
            createTable(parseCode('let x=1;\n' +
                'if ( a[x+1]==1){\n' +
                '\tx=2;\n' +
                '}\n')),
            '<table border="1"><tr><td> Line </td><td> Type </td><td> Name </td><td> Condition </td><td> Value </td></tr><tr><td>1</td><td>Variable Declaration</td><td>x</td><td></td><td>1</td></tr><tr><td>2</td><td>If Statement</td><td></td><td>a[x+1]==1</td><td></td></tr><tr><td>3</td><td>Assignment Expression</td><td>x</td><td></td><td>2</td></tr></table>'
        );
    });
    it('is parsing a if statement correctly', () => {
        assert.equal(
            createTable(parseCode('let x=true;\n' +
                'if (x){\n' +
                '\tx=false;\n' +
                '}\n')),
            '<table border="1"><tr><td> Line </td><td> Type </td><td> Name </td><td> Condition </td><td> Value </td></tr><tr><td>1</td><td>Variable Declaration</td><td>x</td><td></td><td>true</td></tr><tr><td>2</td><td>If Statement</td><td></td><td>x</td><td></td></tr><tr><td>3</td><td>Assignment Expression</td><td>x</td><td></td><td>false</td></tr></table>'
        );
    });
    it('is parsing a while statement correctly', () => {
        assert.equal(
            createTable(parseCode('let x=true;\n' +
                'while(x){\n' +
                '\tx=false;\n' +
                '}\n')),
            '<table border="1"><tr><td> Line </td><td> Type </td><td> Name </td><td> Condition </td><td> Value </td></tr><tr><td>1</td><td>Variable Declaration</td><td>x</td><td></td><td>true</td></tr><tr><td>2</td><td>While Statement</td><td></td><td>x</td><td></td></tr><tr><td>3</td><td>Assignment Expression</td><td>x</td><td></td><td>false</td></tr></table>'
        );
    });

    it('is parsing a complex for statement and update expression correctly', () => {
        assert.equal(
            createTable(parseCode('for(let i=0 ; i<=10 ; i++){\n' +
                '\tx++;\n' +
                '}\n')),
            '<table border="1"><tr><td> Line </td><td> Type </td><td> Name </td><td> Condition </td><td> Value </td></tr><tr><td>1</td><td>For Statement</td><td></td><td>let i=0 ; i&lt=10 ; i++</td><td></td></tr><tr><td>2</td><td>Update Expression</td><td>x</td><td></td><td>x++</td></tr></table>'
        );
    });
    it('is parsing a complex for statement and update expression correctly', () => {
        assert.equal(
            createTable(parseCode('var array1 = [\'a\', \'b\', \'c\'];')),
            '<table border="1"><tr><td> Line </td><td> Type </td><td> Name </td><td> Condition </td><td> Value </td></tr><tr><td>1</td><td>Variable Declaration</td><td>array1</td><td></td><td>[a , b , c]</td></tr></table>'
        );
    });
});
