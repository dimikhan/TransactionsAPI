package com.anz.apic.org.frameworkapi;


import org.junit.runner.RunWith;

import de.helwich.junit.JasmineTest;
import de.helwich.junit.JasmineTestRunner;

@RunWith(JasmineTestRunner.class)
@JasmineTest(
    src =  { "lib/Require" },
    test = { "b2bConfigTest"},
    browser = false
)
public class CatalogConfigTest {
}
