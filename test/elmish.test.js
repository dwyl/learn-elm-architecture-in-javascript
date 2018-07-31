const test = require('tape');       // https://github.com/dwyl/learn-tape
const fs = require('fs');           // read html files (see below)
const path = require('path');       // so we can open files cross-platform
const elmish = require('../examples/todo-list/elmish.js');
const html = fs.readFileSync(path.resolve(__dirname,
  '../examples/todo-list/index.html'));
require('jsdom-global')(html);      // https://github.com/rstacruz/jsdom-global
const id = 'test-app';              // all tests use separate root element

test('elmish.empty("root") removes DOM elements from container', function (t) {
  // setup the test div:
  const text = 'Hello World!'
  const divid = "mydiv";
  const root = document.getElementById(id);
  const div = document.createElement('div');
  div.id = divid;
  const txt = document.createTextNode(text);
  div.appendChild(txt);
  root.appendChild(div);
  // check text of the div:
  const actual = document.getElementById(divid).textContent;
  t.equal(actual, text, "Contents of mydiv is: " + actual + ' == ' + text);
  t.equal(root.childElementCount, 1, "Root element " + id + " has 1 child el");
  // empty the root DOM node:
  elmish.empty(root); // exercise the `empty` function!
  t.equal(root.childElementCount, 0, "After empty(root) has 0 child elements!")
  t.end();
});

// use view and update from counter-reset example
// to confirm that our elmish.mount function is generic!
const { view, update } = require('../examples/counter-reset/counter.js');

test('elmish.mount app expect state to be Zero', function (t) {
  const root = document.getElementById(id);
  elmish.mount(7, update, view, id);
  const actual = document.getElementById(id).textContent;
  const actual_stripped = parseInt(actual.replace('+', '')
    .replace('-Reset', ''), 10);
  const expected = 7;
  t.equal(expected, actual_stripped, "Inital state set to 7.");
  // reset to zero:
  const btn = root.getElementsByClassName("reset")[0]; // click reset button
  btn.click(); // Click the Reset button!
  const state = parseInt(root.getElementsByClassName('count')[0]
    .textContent, 10);
  t.equal(state, 0, "State is 0 (Zero) after reset."); // state reset to 0!
  elmish.empty(root); // clean up after tests
  t.end()
});
//
//
// test('elmish.add_attributes adds "autofocus" attribute', function (t) {
//   document.getElementById(id).appendChild(
//     elmish.add_attributes(["class=new-todo", "autofocus", "id=new"],
//       document.createElement('input')
//     )
//   );
//   // document.activeElement via: https://stackoverflow.com/a/17614883/1148249
//   t.equal(document.getElementById('new'), document.activeElement,
//     '<input autofocus> is "activeElement"');
//   elmish.empty(document.getElementById(id));
//   t.end();
// });
//
test('elmish.add_attributes applies HTML class attribute to el', function (t) {
  const root = document.getElementById(id);
  let div = document.createElement('div');
  div.id = 'divid';
  div = elmish.add_attributes(["class=apptastic"], div);
  root.appendChild(div);
  // test the div has the desired class:
  const nodes = document.getElementsByClassName('apptastic');
  t.equal(nodes.length, 1, "<div> has 'apptastic' CSS class applied");
  t.end();
});
//
// test('elmish.add_attributes applies id HTML attribute to a node', function (t) {
//   const root = document.getElementById(id);
//   let el = document.createElement('section');
//   el = elmish.add_attributes(["id=myid"], el);
//   const text = 'hello world!'
//   var txt = document.createTextNode(text);
//   el.appendChild(txt);
//   root.appendChild(el);
//   const actual = document.getElementById('myid').textContent;
//   t.equal(actual, text, "<section> has 'myid' id attribute");
//   elmish.empty(root); // clear the "DOM"/"state" before next test
//   t.end();
// });
//
// test('elmish.add_attributes applies multiple attribute to node', function (t) {
//   const root = document.getElementById(id);
//   elmish.empty(root);
//   let el = document.createElement('span');
//   el = elmish.add_attributes(["id=myid", "class=totes mcawesome"], el);
//   const text = 'hello world'
//   var txt = document.createTextNode(text);
//   el.appendChild(txt);
//   root.appendChild(el);
//   const actual = document.getElementById('myid').textContent;
//   t.equal(actual, text, "<section> has 'myid' id attribute");
//   t.equal(el.className, 'totes mcawesome', "CSS class applied: ", el.className);
//   t.end();
// });
//
test('elmish.add_attributes set placeholder on <input> element', function (t) {
  const root = document.getElementById(id);
  let input = document.createElement('input');
  input.id = 'new-todo';
  input = elmish.add_attributes(["placeholder=What needs to be done?"], input);
  root.appendChild(input);
  const placeholder = document.getElementById('new-todo')
    .getAttribute("placeholder");
  t.equal(placeholder, "What needs to be done?", "paceholder set on <input>");
  t.end();
});
//
// test('elmish.add_attributes set data-id on <li> element', function (t) {
//   const root = document.getElementById(id);
//   let li = document.createElement('li');
//   li.id = 'task1';
//   li = elmish.add_attributes(["data-id=123"], li);
//   root.appendChild(li);
//   const data_id = document.getElementById('task1').getAttribute("data-id");
//   t.equal(data_id, '123', "data-id successfully added to <li> element");
//   t.end();
// });
//
// test('elmish.add_attributes set "for" attribute <label> element', function (t) {
//   const root = document.getElementById(id);
//   let li = document.createElement('li');
//   li.id = 'toggle';
//   li = elmish.add_attributes(["for=toggle-all"], li);
//   root.appendChild(li);
//   const label_for = document.getElementById('toggle').getAttribute("for");
//   t.equal(label_for, "toggle-all", '<label for="toggle-all">');
//   t.end();
// });
//
// test('elmish.add_attributes type="checkbox" on <input> element', function (t) {
//   const root = document.getElementById(id);
//   let input = document.createElement('input');
//   input = elmish.add_attributes(["type=checkbox", "id=toggle-all"], input);
//   root.appendChild(input);
//   const type_atrr = document.getElementById('toggle-all').getAttribute("type");
//   t.equal(type_atrr, "checkbox", '<input id="toggle-all" type="checkbox">');
//   t.end();
// });
//
// test('elmish.add_attributes apply style="display: block;"', function (t) {
//   const root = document.getElementById(id);
//   elmish.empty(root);
//   let sec = document.createElement('section');
//   root.appendChild(
//     elmish.add_attributes(["id=main", "style=display: block;"], sec)
//   );
//   const style = window.getComputedStyle(document.getElementById('main'));
//   t.equal(style._values.display, 'block', 'style="display: block;" applied!')
//   t.end();
// });
//
// test('elmish.add_attributes checked=true on "done" item', function (t) {
//   const root = document.getElementById(id);
//   elmish.empty(root);
//   let input = document.createElement('input');
//   input = elmish.add_attributes(["type=checkbox", "id=item1", "checked=true"],
//     input);
//   root.appendChild(input);
//   const checked = document.getElementById('item1').checked;
//   t.equal(checked, true, '<input type="checkbox" checked=true>');
//   // test "checked=false" so we know we are able to "toggle" a todo item:
//   root.appendChild(
//     elmish.add_attributes(
//       ["type=checkbox", "id=item2", "checked=false"],
//       document.createElement('input')
//     )
//   );
//   t.equal(document.getElementById('item2').checked, false, 'checked=false');
//   t.end();
// });
//
// test('elmish.add_attributes <a href="#/active">Active</a>', function (t) {
//   const root = document.getElementById(id);
//   elmish.empty(root);
//   root.appendChild(
//     elmish.add_attributes(["href=#/active", "class=selected", "id=active"],
//       document.createElement('a')
//     )
//   );
//   // note: "about:blank" is the JSDOM default "window.location.href"
//   console.log('JSDOM window.location.href:', window.location.href);
//   // so when an href is set *relative* to this it becomes "about:blank#/my-link"
//   // so we *remove* it before the assertion below, but it works fine in browser!
//   const href = document.getElementById('active').href.replace('about:blank', '')
//   t.equal(href, "#/active", 'href="#/active" applied to "active" link');
//   t.end();
// });
//
/** DEFAULT BRANCH **/
test('test default branch of elmish.add_attributes (no effect)', function (t) {
  const root = document.getElementById(id);
  let div = document.createElement('div');
  div.id = 'divid';
  // "Clone" the div DOM node before invoking elmish.attributes to compare
  const clone = div.cloneNode(true);
  div = elmish.add_attributes(["unrecognised_attribute=noise"], div);
  t.deepEqual(div, clone, "<div> has not been altered");
  t.end();
});

/** null attrlist **/
test('test elmish.add_attributes attrlist null (no effect)', function (t) {
  const root = document.getElementById(id);
  let div = document.createElement('div');
  div.id = 'divid';
  // "Clone" the div DOM node before invoking elmish.attributes to compare
  const clone = div.cloneNode(true);
  div = elmish.add_attributes(null, div); // should not "explode"
  t.deepEqual(div, clone, "<div> has not been altered");
  t.end();
});

//
// test('elmish.append_childnodes append child DOM nodes to parent', function (t) {
//   const root = document.getElementById(id);
//   elmish.empty(root); // clear the test DOM before!
//   let div = document.createElement('div');
//   let p = document.createElement('p');
//   let section = document.createElement('section');
//   elmish.append_childnodes([div, p, section], root);
//   t.equal(root.childElementCount, 3, "Root element " + id + " has 3 child els");
//   t.end();
// });
//
// test('elmish.section creates a <section> HTML element', function (t) {
//   const p = document.createElement('p');
//   p.id = 'para';
//   const text = 'Hello World!'
//   const txt = document.createTextNode(text);
//   p.appendChild(txt);
//   // create the `<section>` HTML element using our section function
//   const section = elmish.section(["class=new-todo"], [p])
//   document.getElementById(id).appendChild(section); // add section with <p>
//   // document.activeElement via: https://stackoverflow.com/a/17614883/1148249
//   t.equal(document.getElementById('para').textContent, text,
//     '<section> <p>' + text + '</p></section> works as expected!');
//   elmish.empty(document.getElementById(id));
//   t.end();
// });
//
// test('elmish create <header> view using HTML element functions', function (t) {
//   const { append_childnodes, section, header, h1, text, input } = elmish;
//   append_childnodes([
//     section(["class=todoapp"], [ // array of "child" elements
//       header(["class=header"], [
//         h1([], [
//           text("todos")
//         ]), // </h1>
//         input([
//           "id=new",
//           "class=new-todo",
//           "placeholder=What needs to be done?",
//           "autofocus"
//         ], []) // <input> is "self-closing"
//       ]) // </header>
//     ])
//   ], document.getElementById(id));
//
//   const place = document.getElementById('new').getAttribute('placeholder');
//   t.equal(place, "What needs to be done?", "placeholder set in <input> el");
//   t.equal(document.querySelector('h1').textContent, 'todos', '<h1>todos</h1>');
//   elmish.empty(document.getElementById(id));
//   t.end();
// });
//
// test('elmish create "main" view using HTML DOM functions', function (t) {
//   const { section, input, label, ul, li, div, button, text } = elmish;
//   elmish.append_childnodes([
//     section(["class=main", "style=display: block;"], [
//       input(["id=toggle-all", "class=toggle-all", "type=checkbox"], []),
//       label(["for=toggle-all"], [ text("Mark all as complete") ]),
//       ul(["class=todo-list"], [
//         li(["data-id=123", "class=completed"], [
//           div(["class=view"], [
//             input(["class=toggle", "type=checkbox", "checked=true"], []),
//             label([], [text('Learn The Elm Architecture ("TEA")')]),
//             button(["class=destroy"])
//           ]) // </div>
//         ]), // </li>
//         li(["data-id=234"], [
//           div(["class=view"], [
//             input(["class=toggle", "type=checkbox"], []),
//             label([], [text("Build TEA Todo List App")]),
//             button(["class=destroy"])
//           ]) // </div>
//         ]) // </li>
//       ]) // </ul>
//     ])
//   ], document.getElementById(id));
//   const done = document.querySelectorAll('.completed')[0].textContent;
//   t.equal(done, 'Learn The Elm Architecture ("TEA")', 'Done: Learn "TEA"');
//   const todo = document.querySelectorAll('.view')[1].textContent;
//   t.equal(todo, 'Build TEA Todo List App', 'Todo: Build TEA Todo List App');
//   elmish.empty(document.getElementById(id));
//   t.end();
// });
//
// test('elmish create <footer> view using HTML DOM functions', function (t) {
//   const { footer, span, strong, text, ul, li, a, button } = elmish;
//   elmish.append_childnodes([
//     footer(["class=footer", "style=display: block;"], [
//       span(["class=todo-count", "id=count"], [
//         strong("1"),
//         text("item left")
//       ]),
//       ul(["class=filters"], [
//         li([], [
//           a(["href=#/", "class=selected"], [text("All")])
//         ]),
//         li([], [
//           a(["href=#/active"], [text("Active")])
//         ]),
//         li([], [
//           a(["href=#/completed"], [text("Completed")])
//         ])
//       ]), // </ul>
//       button(["class=clear-completed", "style=display:block;"],
//         [text("Clear completed")]
//       )
//     ])
//   ], document.getElementById(id));
//
//   const left = document.getElementById('count').textContent;
//   t.equal(left, "item left", 'there is 1 todo item left');
//   const clear = document.querySelectorAll('button')[1].textContent;
//   t.equal(clear, "Clear completed", '<button> text is "Clear completed"');
//   const selected = document.querySelectorAll('.selected')[1].textContent;
//   t.equal(selected, "All", "All is selected by default");
//   elmish.empty(document.getElementById(id));
//   t.end();
// });
//
// test('elmish.route updates the url hash and sets history', function (t) {
//   const initial_hash = window.location.hash
//   console.log('START window.location.hash:', initial_hash, '(empty string)');
//   const initial_history_length = window.history.length;
//   console.log('START window.history.length:', initial_history_length);
//   // update the URL Hash and Set Browser History
//   const state = { hash: '' };
//   const new_hash = '#/active'
//   const new_state = elmish.route(state, 'Active', new_hash);
//   console.log('UPDATED window.history.length:', window.history.length);
//   console.log('UPDATED state:', new_state);
//   console.log('UPDATED window.location.hash:', window.location.hash);
//   t.notEqual(initial_hash, window.location.hash, "location.hash has changed!");
//   t.equal(new_hash, new_state.hash, "state.hash is now: " + new_state.hash);
//   t.equal(new_hash, window.location.hash, "window.location.hash: "
//     + window.location.hash);
//   t.equal(initial_history_length + 1, window.history.length,
//     "window.history.length increased from: " + initial_history_length + ' to: '
//     + window.history.length);
//   t.end();
// });
//
//
// Testing localStorage requires "polyfil" because:
// https://github.com/jsdom/jsdom/issues/1137 ¯\_(ツ)_/¯
global.localStorage = { // globals are bad! but a "necessary evil" here ...
  getItem: function(key) {
   const value = this[key];
   return typeof value === 'undefined' ? null : value;
 },
 setItem: function (key, value) {
   this[key] = value;
 }
}
localStorage.setItem('hello', 'world!');
// console.log('localStorage (polyfil) hello', localStorage.getItem('hello'));

// // Test mount's localStorage using view and update from counter-reset example
// // to confirm that our elmish.mount localStorage works and is "generic".
//
// test('elmish.mount sets model in localStorage', function (t) {
//   const { view, update } = require('../examples/counter-reset/counter.js');
//
//   const root = document.getElementById(id);
//   elmish.mount(7, update, view, id);
//   // the "model" stored in localStorage should be 7 now:
//   t.equal(JSON.parse(localStorage.getItem('elmish_store')), 7,
//     "elmish_store is 7 (as expected). initial state saved to localStorage.");
//   // test that mount still works as expected (check initial state of counter):
//   const actual = document.getElementById(id).textContent;
//   const actual_stripped = parseInt(actual.replace('+', '')
//     .replace('-Reset', ''), 10);
//   const expected = 7;
//   t.equal(expected, actual_stripped, "Inital state set to 7.");
//   // attempting to "re-mount" with a different model value should not work
//   // because mount should retrieve the value from localStorage
//   elmish.mount(42, update, view, id); // model (42) should be ignored this time!
//   t.equal(JSON.parse(localStorage.getItem('elmish_store')), 7,
//     "elmish_store is 7 (as expected). initial state saved to localStorage.");
//   // increment the counter
//   const btn = root.getElementsByClassName("inc")[0]; // click increment button
//   btn.click(); // Click the Increment button!
//   const state = parseInt(root.getElementsByClassName('count')[0]
//     .textContent, 10);
//   t.equal(state, 8, "State is 8 after increment.");
//   // the "model" stored in localStorage should also be 8 now:
//   t.equal(JSON.parse(localStorage.getItem('elmish_store')), 8,
//     "elmish_store is 8 (as expected).");
//   elmish.empty(root); // reset the DOM to simulate refreshing a browser window
//   elmish.mount(5, update, view, id); // 5 ignored! read model from localStorage
//   // clearing DOM does NOT clear the localStorage (this is desired behaviour!)
//   t.equal(JSON.parse(localStorage.getItem('elmish_store')), 8,
//     "elmish_store still 8 from increment (above) saved in localStorage");
//   t.end()
// });
